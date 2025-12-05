import { createClient } from '@/lib/supabase/server';
import { GmailProvider } from '../providers/gmail';
import { OutlookProvider } from '../providers/outlook';
import { decrypt } from '@/lib/encryption';

import { SupabaseClient } from '@supabase/supabase-js';

export class SyncEngine {
  constructor(private client?: SupabaseClient) {}

  async syncAccount(accountId: string) {
    const supabase = this.client || await createClient();
    const { data: account } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (!account) throw new Error('Account not found');

    // Feature Gating: Check Plan Limits
    const { data: user } = await supabase.from('users').select('plan').eq('id', account.user_id).single();
    if (user?.plan === 'FREE') {
      // Example restriction: Only sync last 500 emails
      // In a real scenario, we might check account count here too
    }

    let provider;
    const accessToken = decrypt(account.access_token);
    const refreshToken = decrypt(account.refresh_token); // Note: Outlook might need refresh logic if access token expired

    if (account.provider === 'google') {
      provider = new GmailProvider(accessToken, refreshToken);
    } else if (account.provider === 'outlook') {
      provider = new OutlookProvider(accessToken);
    } else {
      throw new Error('Provider not supported');
    }

    const limit = user?.plan === 'FREE' ? 500 : 1000;
    await provider.connect();
    const emails = await provider.listEmails({ limit });

    // Save to DB in batches
    const BATCH_SIZE = 100;
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE).map(email => ({
        account_id: accountId,
        user_id: account.user_id,
        remote_id: email.id,
        subject: email.subject,
        snippet: email.snippet,
        sender_name: email.sender.name,
        sender_address: email.sender.address,
        received_at: email.date.toISOString(),
        body: email.body,
        body_html: email.bodyHtml,
        // TODO: Classification
      }));

      const { error } = await supabase.from('emails').upsert(batch, { 
        onConflict: 'account_id, remote_id' 
      });

      if (error) {
        console.error('Error saving batch:', error);
      }
    }
  }
}
