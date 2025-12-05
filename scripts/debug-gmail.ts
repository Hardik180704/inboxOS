import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
// Dynamic imports or just ensure these are imported after config if possible, 
// but in ESM 'import' is hoisted. 
// We will use dynamic import() inside the function or just rely on the fact that 
// we can't easily change import order in a single file without top-level await or require.
// Let's try to use dynamic imports for the libs.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugGmail() {
  // Dynamically import to ensure env vars are loaded
  const { GmailProvider } = await import('../core/providers/gmail');
  const { decrypt } = await import('../lib/encryption');

  console.log('Starting Gmail debug...');

  // Get the first Gmail account
  const { data: accounts, error } = await supabase
    .from('email_accounts')
    .select('*')
    .eq('provider', 'google')
    .limit(1);

  if (error || !accounts || accounts.length === 0) {
    console.error('No Gmail account found to debug');
    return;
  }

  const account = accounts[0];
  console.log(`Debugging account: ${account.email_address}`);

  const accessToken = decrypt(account.access_token);
  const refreshToken = decrypt(account.refresh_token);

  const provider = new GmailProvider(accessToken, refreshToken);
  await provider.connect();

  console.log('Connected to Gmail. Fetching 1 email...');
  
  // Fetch just 1 email to inspect
  const { emails } = await provider.listEmails({ limit: 1 });

  if (emails.length === 0) {
    console.log('No emails found.');
    return;
  }

  const email = emails[0];
  console.log('--- Email Debug Info ---');
  console.log('ID:', email.id);
  console.log('Subject:', email.subject);
  console.log('Snippet:', email.snippet);
  console.log('Body Length:', email.body?.length);
  console.log('Body HTML Length:', email.bodyHtml?.length);
  console.log('Body Preview:', email.body?.substring(0, 100));
  console.log('------------------------');
}

debugGmail().catch(console.error);
