import { createClient } from '@supabase/supabase-js';
import { SyncEngine } from '../core/engine/sync';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function main() {
  console.log('Initializing Supabase client...');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('Fetching email accounts...');
  const { data: accounts, error } = await supabase
    .from('email_accounts')
    .select('*');

  if (error) {
    console.error('Error fetching accounts:', error);
    return;
  }

  if (!accounts || accounts.length === 0) {
    console.log('No email accounts found.');
    return;
  }

  console.log(`Found ${accounts.length} accounts.`);

  const engine = new SyncEngine(supabase);

  for (const account of accounts) {
    console.log(`Syncing account: ${account.email_address} (${account.provider})`);
    try {
      const result = await engine.syncAccount(account.id);
      console.log('Sync result:', result);
    } catch (err) {
      console.error(`Sync failed for ${account.email_address}:`, err);
    }
  }
}

main();
