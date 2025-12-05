import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SyncEngine } from '@/core/engine/sync';

export async function POST(_request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all email accounts for the user
    const { data: accounts, error: accountsError } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('user_id', user.id);

    if (accountsError) {
      console.error('Error fetching accounts:', accountsError);
      return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
    }

    if (!accounts || accounts.length === 0) {
      return NextResponse.json({ message: 'No accounts to sync' });
    }

    const engine = new SyncEngine();
    const results = [];

    // Sync each account
    for (const account of accounts) {
      try {
        await engine.syncAccount(account.id);
        results.push({ accountId: account.id, status: 'success' });
      } catch (error) {
        console.error(`Sync failed for account ${account.id}:`, error);
        results.push({ accountId: account.id, status: 'failed', error: String(error) });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Sync API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
