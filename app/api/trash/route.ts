import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/encryption'
import { GmailProvider } from '@/core/providers/gmail'
import { OutlookProvider } from '@/core/providers/outlook'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get active account (use headers or query param, default to first connected)
  // For simplicity MVP, we'll fetch from the first connected account or all?
  // Fetching from all live is slow. Let's just pick the first one for now or require account selection.
  // Better: The UI should probably allow switching or just show "Connect account".
  // Let's get all connected accounts and fetch from them in parallel (up to a limit).
  
  const { data: accounts } = await supabase
    .from('email_accounts')
    .select('*')
    .eq('user_id', user.id)

  if (!accounts?.length) return NextResponse.json([])

  const promises = accounts.map(async (account) => {
      try {
        const accessToken = decrypt(account.access_token)
        const refreshToken = decrypt(account.refresh_token)
        let provider
        let results: any[] = []

        if (account.provider === 'google') {
            provider = new GmailProvider(accessToken, refreshToken)
             // Use public method or cast to any if necessary. 
             // Logic: GmailProvider.listEmails accepts query.
            const res = await provider.listEmails({ limit: 20, query: 'in:trash' })
            results = res.emails
        } else if (account.provider === 'outlook') {
            provider = new OutlookProvider(accessToken)
            // Outlook doesn't support 'query' string in the same way in listEmails implementation yet
            // But we can try to impl if time permits, or just skip.
            // For now, let's skip Outlook trash or return empty.
        }

        return results?.map((e: any) => ({ ...e, account_id: account.id, provider: account.provider })) || []
      } catch (e) {
          console.error(e)
          return []
      }
  })

  const results = await Promise.all(promises)
  const allTrash = results.flat().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return NextResponse.json(allTrash)
}
