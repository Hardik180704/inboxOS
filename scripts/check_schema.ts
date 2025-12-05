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
  console.log('Checking email_accounts schema...');
  
  // Try to select the new columns
  const { data, error } = await supabase
    .from('email_accounts')
    .select('id, last_history_id, delta_token')
    .limit(1);

  if (error) {
    console.error('Error selecting columns:', error.message);
    console.log('It seems the migration was NOT applied.');
  } else {
    console.log('Success! Columns exist.');
    console.log('Sample data:', data);
  }
}

main();
