import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data?.session) {
      try {
        // Save tokens to email_accounts
        const { session } = data
        const { user } = session
        const provider = user.app_metadata.provider
        const providerToken = session.provider_token
        const providerRefreshToken = session.provider_refresh_token

        if (providerToken && (provider === 'google' || provider === 'azure')) {
          console.log('Attempting to save tokens for provider:', provider);
          
          // Dynamic import to avoid edge runtime issues
          const { encrypt } = await import('@/lib/encryption')
          console.log('Encryption module loaded');
          
          // Use Service Role to bypass RLS and ensure we can write
          const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
          const supabaseAdmin = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
          )
          console.log('Supabase Admin client created');
          
          // Check if account exists to update or insert
          const { data: existing, error: fetchError } = await supabaseAdmin
            .from('email_accounts')
            .select('id')
            .eq('user_id', user.id)
            .eq('email_address', user.email!)
            .single()
            
          if (fetchError && fetchError.code !== 'PGRST116') {
             console.error('Error fetching existing account:', fetchError);
          }

          if (existing) {
              console.log('Updating existing account:', existing.id);
              const { error: updateError } = await supabaseAdmin.from('email_accounts').update({
                  access_token: encrypt(providerToken),
                  refresh_token: providerRefreshToken ? encrypt(providerRefreshToken) : null,
                  updated_at: new Date().toISOString(),
              }).eq('id', existing.id)
              if (updateError) console.error('Error updating account:', updateError);
          } else {
              console.log('Inserting new account');
              const { error: insertError } = await supabaseAdmin.from('email_accounts').insert({
                  user_id: user.id,
                  provider: provider === 'azure' ? 'outlook' : provider,
                  email_address: user.email!,
                  access_token: encrypt(providerToken),
                  refresh_token: providerRefreshToken ? encrypt(providerRefreshToken) : null,
              })
              if (insertError) console.error('Error inserting account:', insertError);
          }
        }
      } catch (err) {
        console.error('Error saving tokens:', err)
        // Continue with redirect even if token saving fails, to avoid blocking login
      }

      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
