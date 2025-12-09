import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/encryption'
import { GmailProvider } from '@/core/providers/gmail'
import { OutlookProvider } from '@/core/providers/outlook'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch emails with significant size (> 1MB) or attachments
  const { data: emails, error } = await supabase
    .from('emails')
    .select('id, remote_id, subject, sender_name, sender_address, received_at, size_estimate, has_attachments, account_id')
    .eq('user_id', user.id)
    .not('is_archived', 'is', true)
    // We want items that take up space. 
    // Either they have explicit attachment flag OR are larger than 1MB (1000000 bytes)
    // Note: 'or' syntax in Supabase JS is tricky with complex filters. 
    // For V1, let's just sort by size_estimate descending.
    .order('size_estimate', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(emails)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action, emailIds } = await request.json()

  if (action === 'trash') {
    // 1. Group by account to batch provider calls
    const { data: emails } = await supabase
      .from('emails')
      .select('id, remote_id, account_id')
      .in('id', emailIds)
      .eq('user_id', user.id)

    if (!emails?.length) return NextResponse.json({ count: 0 })

    const emailsByAccount = new Map<string, string[]>()
    emails.forEach(e => {
        const list = emailsByAccount.get(e.account_id) || []
        list.push(e.remote_id)
        emailsByAccount.set(e.account_id, list)
    })

    // 2. Perform deletion per account
    for (const [accountId, remoteIds] of emailsByAccount.entries()) {
        const { data: account } = await supabase
        .from('email_accounts')
        .select('access_token, refresh_token, provider')
        .eq('id', accountId)
        .single()

        if (account) {
            const accessToken = decrypt(account.access_token)
            const refreshToken = decrypt(account.refresh_token)
            let provider

            if (account.provider === 'google') {
                provider = new GmailProvider(accessToken, refreshToken)
            } else if (account.provider === 'outlook') {
                provider = new OutlookProvider(accessToken)
            }

            if (provider) {
                // Batch processing
                const CHUNK_SIZE = 50
                for (let i = 0; i < remoteIds.length; i += CHUNK_SIZE) {
                    await provider.delete(remoteIds.slice(i, i + CHUNK_SIZE))
                }
            }
        }
    }

    // 3. Mark as deleted in DB (or remove)
    // "Trash" typically means remove from our main view or mark as is_deleted if we had that.
    // Since we don't have is_deleted, we'll hard delete from our DB to keep in sync, 
    // or just mark is_archived = true? No, Trash != Archive.
    // Let's delete from our DB so it disappears from the list.
    await supabase
      .from('emails')
      .delete()
      .in('id', emailIds)

    return NextResponse.json({ success: true, count: emails.length })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
