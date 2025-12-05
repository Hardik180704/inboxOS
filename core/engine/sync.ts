import { createClient } from '@/lib/supabase/server';
import { GmailProvider } from '../providers/gmail';
import { OutlookProvider } from '../providers/outlook';
import { decrypt } from '@/lib/encryption';

export class SyncEngine {
  async syncAccount(accountId: string) {
    const supabase = await createClient();
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

    await provider.connect();
    const emails = await provider.listEmails({ limit: 50 });

    // Save to DB
    for (const email of emails) {
      await supabase.from('emails').upsert({
        account_id: accountId,
        user_id: account.user_id,
        remote_id: email.id,
        subject: email.subject,
        snippet: email.snippet,
        sender_name: email.sender.name,
        sender_address: email.sender.address,
        received_at: email.date.toISOString(),
        // TODO: Classification
      }, { onConflict: 'account_id, remote_id' });
    }
  }
}
