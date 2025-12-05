import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function main() {
  const { data: accounts } = await supabase
    .from('email_accounts')
    .select('id, email_address, provider, last_history_id');

  console.log('Accounts:');
  accounts?.forEach(acc => {
    console.log(`- ${acc.email_address} (${acc.provider}) ID: ${acc.id}`);
    console.log(`  Last History ID: ${acc.last_history_id}`);
  });
}

main();
