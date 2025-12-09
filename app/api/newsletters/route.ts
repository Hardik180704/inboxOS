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

  // Fetch emails that have list-unsubscribe header
  // Note: We use the arrow operator ->> to check for existence/value in JSONB
  const { data: emails, error } = await supabase
    .from('emails')
    .select('id, remote_id, sender_address, sender_name, received_at, metadata, account_id')
    .eq('user_id', user.id)
    .not('metadata->list_unsubscribe', 'is', null)
    .order('received_at', { ascending: false })
    .limit(1000)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Group by sender
  const newsletters = new Map()

  emails.forEach(email => {
    const sender = email.sender_address
    if (!newsletters.has(sender)) {
      newsletters.set(sender, {
        sender_address: sender,
        sender_name: email.sender_name,
        latest_received_at: email.received_at,
        count: 0,
        sample_email_id: email.id,
        sample_remote_id: email.remote_id,
        account_id: email.account_id,
        unsubscribe_link: email.metadata?.list_unsubscribe
      })
    }
    const data = newsletters.get(sender)
    data.count++
  })

  return NextResponse.json(Array.from(newsletters.values()))
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action, sender_address, sample_remote_id, account_id } = await request.json()

  if (action === 'archive_all') {
    // 1. Find all emails from this sender
    const { data: emails } = await supabase
      .from('emails')
      .select('remote_id')
      .eq('user_id', user.id)
      .eq('sender_address', sender_address)
      .eq('account_id', account_id) // Scope to specific account to avoid mix-up

    if (!emails?.length) return NextResponse.json({ count: 0 })

    // 2. Archive on Provider
    // Fetch account tokens
    const { data: account } = await supabase
      .from('email_accounts')
      .select('access_token, refresh_token, provider')
      .eq('id', account_id)
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
         const remoteIds = emails.map(e => e.remote_id)
         // Batch processing
         const CHUNK_SIZE = 50
         for (let i = 0; i < remoteIds.length; i += CHUNK_SIZE) {
            await provider.archive(remoteIds.slice(i, i + CHUNK_SIZE))
         }
       }
    }

    // 3. Mark as archived in DB
    await supabase
      .from('emails')
      .update({ is_archived: true })
      .eq('user_id', user.id)
      .eq('sender_address', sender_address)

    return NextResponse.json({ success: true, count: emails.length })
  }

  if (action === 'unsubscribe') {
    // 1. Fetch account to call provider
    const { data: account } = await supabase
      .from('email_accounts')
      .select('access_token, refresh_token, provider')
      .eq('id', account_id)
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

       if (provider && sample_remote_id) {
         try {
           await provider.unsubscribe(sample_remote_id)
           return NextResponse.json({ success: true })
         } catch (e) {
           console.error(e)
           return NextResponse.json({ error: 'Provider unsubscribe failed' }, { status: 500 })
         }
       }
    }
    return NextResponse.json({ error: 'Failed to init provider' }, { status: 400 })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
