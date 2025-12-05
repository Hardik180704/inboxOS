import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Fetching all email accounts...');
  const { data: accounts, error } = await supabase
    .from('email_accounts')
    .select('id, user_id, provider, email_address, created_at');

  if (error) {
    console.error('Error fetching accounts:', error);
    return;
  }

  console.log(`Found ${accounts.length} accounts:`);
  accounts.forEach(acc => {
    console.log(`- [${acc.provider}] ${acc.email_address} (User: ${acc.user_id})`);
  });

  console.log('\nFetching users...');
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, email, plan');
  
  if (usersError) {
    console.error('Error fetching users:', usersError);
    return;
  }

  console.log(`Found ${users.length} users:`);
  users.forEach(u => {
    console.log(`- ${u.email} (ID: ${u.id}) Plan: ${u.plan}`);
  });
}

main();
