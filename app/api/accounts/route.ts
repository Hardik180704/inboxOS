import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch accounts
    const { data: accounts, error } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;

    // Fetch user plan
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('plan')
      .eq('id', user.id)
      .single();

    if (userError) throw userError;

    return NextResponse.json({
      accounts: accounts || [],
      plan: userData?.plan || 'FREE',
    });
  } catch (error) {
    console.error('Accounts fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
