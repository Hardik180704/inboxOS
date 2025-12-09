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

  // 1. Fetch potential duplicates
  // We want to find groups of emails with same sender, subject, and very close received_at time.
  // Note: Supabase/PostgREST doesn't support complex window functions or self-joins easily via JS client API.
  // We will fetch recent emails and process in memory for V1 (LIMIT 500 or 1000).
  // A better approach for V2 would be a stored procedure (RPC).
  
  const { data: emails, error } = await supabase
    .from('emails')
    .select('id, remote_id, subject, sender_address, sender_name, received_at, account_id')
    .eq('user_id', user.id)
    .not('is_archived', 'is', true)
    .order('received_at', { ascending: false })
    .limit(1000)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 2. Identify duplicates
  const duplicates = []
  const processed = new Set()

  for (let i = 0; i < emails.length; i++) {
    if (processed.has(emails[i].id)) continue

    const current = emails[i]
    const group = [current]
    
    // Look ahead for matches
    // Since we sorted by date, matches should be close.
    // Window: 60 seconds diff max? Or exact match?
    // Let's say same Subject + Sender + Time within 1 minute.
    
    const timeWindow = 60 * 1000 // 1 minute
    
    for (let j = i + 1; j < emails.length; j++) {
       const other = emails[j]
       if (processed.has(other.id)) continue
       
       // Optimization: stop if time diff is too large
       const timeDiff = new Date(current.received_at).getTime() - new Date(other.received_at).getTime()
       if (Math.abs(timeDiff) > timeWindow) break // Sorted desc, so it will only get larger

       if (
           current.sender_address === other.sender_address &&
           current.subject?.trim() === other.subject?.trim()
       ) {
           group.push(other)
           processed.add(other.id)
       }
    }

    if (group.length > 1) {
        duplicates.push({
            subject: current.subject,
            sender: current.sender_name || current.sender_address,
            count: group.length,
            ids: group.map(e => e.id),
            emails: group
        })
    }
    processed.add(current.id)
  }

  return NextResponse.json(duplicates)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action, groups } = await request.json()

  if (action === 'clean') {
    console.log('Clean action started', { groupsCount: groups?.length })
    let totalDeleted = 0

    try {
      if (!groups || !Array.isArray(groups)) {
        console.error('Invalid groups payload', groups)
        return NextResponse.json({ error: 'Invalid groups payload' }, { status: 400 })
      }

      for (const group of groups) {
        if (!group.emails || group.emails.length < 2) {
             console.log('Skipping invalid group/single email', group)
             continue
        }

         const sorted = group.emails.sort((a: any, b: any) => new Date(b.received_at).getTime() - new Date(a.received_at).getTime())
         // Keep the newest (index 0), delete the rest
         const toDelete = sorted.slice(1) 
         
         if (toDelete.length === 0) continue

         console.log(`Processing group: Keeping ${sorted[0].id}, deleting ${toDelete.length} items`)
         
         // Delete from provider
         const emailsByAccount = new Map<string, string[]>()
          toDelete.forEach((e: any) => {
              if (!e.account_id || !e.remote_id) return
              const list = emailsByAccount.get(e.account_id) || []
              list.push(e.remote_id)
              emailsByAccount.set(e.account_id, list)
          })

          for (const [accountId, remoteIds] of emailsByAccount.entries()) {
              if (remoteIds.length === 0) continue

              try {
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
                          await provider.delete(remoteIds)
                      }
                  }
              } catch (err) {
                  console.error(`Failed to delete duplicates for account ${accountId}:`, err)
                  // Continue to next account/group even if one fails
              }
          }

         // Delete from DB
         const ids = toDelete.map((e: any) => e.id)
         if (ids.length > 0) {
             const { error: dbError } = await supabase.from('emails').delete().in('id', ids)
             if (dbError) console.error('DB delete failed', dbError)
             else totalDeleted += ids.length
         }
      }

      return NextResponse.json({ success: true, count: totalDeleted })

    } catch (e) {
      console.error('Clean API Error:', e)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
