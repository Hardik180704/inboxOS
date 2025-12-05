import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const action = searchParams.get('action')

  if (code) {
    const supabase = await createClient()
    
    // Debug logging
    const { data: { session: debugSession } } = await supabase.auth.getSession()
    const { data: { user: debugUser } } = await supabase.auth.getUser()
    
    const logData = JSON.stringify({ 
      timestamp: new Date().toISOString(),
      hasCode: !!code, 
      action, 
      hasSession: !!debugSession, 
      hasUser: !!debugUser,
      userId: debugUser?.id 
    }, null, 2) + '\n'

    try {
      const fs = await import('fs')
      const path = await import('path')
      const logPath = path.join(process.cwd(), 'callback_debug.log')
      fs.appendFileSync(logPath, logData)
    } catch (e) {
      console.error('Failed to write log', e)
    }

    // If action is 'connect', we need to preserve the current user session
    // and use a separate client to exchange the code for the NEW account's tokens.
    if (action === 'connect') {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (currentUser) {
        // Create a client that can READ cookies (for PKCE verifier) but WON'T WRITE them (to avoid overwriting session)
        const { createServerClient } = await import('@supabase/ssr')
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()

        const customClient = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              getAll() {
                return cookieStore.getAll()
              },
              setAll(_cookiesToSet) {
                // Intentionally do nothing to preserve the existing session
                // The new tokens will be returned in the data object, which we'll save manually
              },
            },
          }
        )
        
        const { data: connectData, error: connectError } = await customClient.auth.exchangeCodeForSession(code)
        
        if (!connectError && connectData?.session) {
           try {
             const fs = await import('fs')
             const path = await import('path')
             fs.appendFileSync(path.join(process.cwd(), 'callback_debug.log'), `Connect success. Email: ${connectData.session.user.email}\n`)
           } catch {}

           // Save tokens using the CURRENT user's ID, but with the NEW account's email/tokens
           const result = await saveTokens(connectData.session, currentUser.id)
           
           if (result?.error) {
             const redirectUrl = new URL(next, origin)
             redirectUrl.searchParams.set('connected', 'limit_reached')
             return NextResponse.redirect(redirectUrl)
           }

           // Redirect back with success param
           const redirectUrl = new URL(next, origin)
           redirectUrl.searchParams.set('connected', 'true')
           return NextResponse.redirect(redirectUrl)
        } else {
           try {
             const fs = await import('fs')
             const path = await import('path')
             fs.appendFileSync(path.join(process.cwd(), 'callback_debug.log'), `Connect error: ${JSON.stringify(connectError)}\n`)
           } catch {}
           console.error('Connect error:', connectError)
           const redirectUrl = new URL(next, origin)
           redirectUrl.searchParams.set('connected', 'error')
           return NextResponse.redirect(redirectUrl)
        }
      }
    }

    // Normal Login Flow
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data?.session) {
      await saveTokens(data.session, data.session.user.id)
      
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}

async function saveTokens(session: any, targetUserId: string) {
  try {
    const fs = await import('fs')
    const path = await import('path')
    const log = (msg: string) => fs.appendFileSync(path.join(process.cwd(), 'callback_debug.log'), `[saveTokens] ${msg}\n`)

    const { user } = session
    const provider = user.app_metadata.provider
    const providerToken = session.provider_token
    const providerRefreshToken = session.provider_refresh_token

    log(`Processing ${user.email} for targetUser ${targetUserId}. Provider: ${provider}`)

    if (providerToken && (provider === 'google' || provider === 'azure')) {
      const { encrypt } = await import('@/lib/encryption')
      const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
      const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      // Use the email from the NEW session (the one we just connected)
      const emailAddress = user.email

      // Check Plan Limits
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('plan')
        .eq('id', targetUserId)
        .single()
      
      const plan = userData?.plan || 'FREE'
      const limit = plan === 'FREE' ? 1 : plan === 'PRO' ? 3 : Infinity
      log(`User plan: ${plan}, Limit: ${limit}`)

      const { count } = await supabaseAdmin
        .from('email_accounts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', targetUserId)
      
      log(`Current account count: ${count}`)

      const { data: existing, error: fetchError } = await supabaseAdmin
        .from('email_accounts')
        .select('id')
        .eq('user_id', targetUserId)
        .eq('email_address', emailAddress)
        .single()
        
      if (fetchError && fetchError.code !== 'PGRST116') {
          log(`Error fetching existing: ${JSON.stringify(fetchError)}`)
      }

      if (existing) {
          log(`Updating existing account ${existing.id}`)
          const { error: updateError } = await supabaseAdmin.from('email_accounts').update({
              access_token: encrypt(providerToken),
              refresh_token: providerRefreshToken ? encrypt(providerRefreshToken) : null,
              updated_at: new Date().toISOString(),
          }).eq('id', existing.id)
          if (updateError) log(`Update error: ${JSON.stringify(updateError)}`)
      } else {
          // Check limit for new accounts
          if (count !== null && count >= limit) {
            log('Plan limit reached')
            return { error: 'Plan limit reached' }
          }

          log('Inserting new account')
          const { error: insertError } = await supabaseAdmin.from('email_accounts').insert({
              user_id: targetUserId,
              provider: provider === 'azure' ? 'outlook' : provider,
              email_address: emailAddress,
              access_token: encrypt(providerToken),
              refresh_token: providerRefreshToken ? encrypt(providerRefreshToken) : null,
          })
          if (insertError) log(`Insert error: ${JSON.stringify(insertError)}`)
      }
    } else {
        log('No provider token or invalid provider')
    }
  } catch (err) {
    console.error('Error saving tokens:', err)
    try {
        const fs = await import('fs')
        const path = await import('path')
        fs.appendFileSync(path.join(process.cwd(), 'callback_debug.log'), `[saveTokens] Error: ${err}\n`)
    } catch {}
  }
}
