import { createClient } from '@/lib/supabase/server';
import { GmailProvider } from '../providers/gmail';
import { OutlookProvider } from '../providers/outlook';
import { decrypt } from '@/lib/encryption';

import { SupabaseClient } from '@supabase/supabase-js';

export class SyncEngine {
  constructor(private client?: SupabaseClient) {}

  async syncAccount(accountId: string) {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const log = (msg: string) => {
        try {
          fs.appendFileSync(path.join(process.cwd(), 'sync_debug.log'), `[${new Date().toISOString()}] ${msg}\n`);
        } catch (e) { console.error(e); }
      };

      log(`Starting sync for account ${accountId}`);

      const supabase = this.client || await createClient();
      const { data: account, error: accountError } = await supabase
        .from('email_accounts')
        .select('*')
        .eq('id', accountId)
        .single();

      if (accountError || !account) {
        log(`Account fetch error: ${JSON.stringify(accountError)}`);
        throw new Error('Account not found');
      }

      // Feature Gating: Check Plan Limits
      const { data: user } = await supabase.from('users').select('plan').eq('id', account.user_id).single();
      
      let provider;
      const accessToken = decrypt(account.access_token);
      const refreshToken = decrypt(account.refresh_token); 

      log(`Provider: ${account.provider}`);

      if (account.provider === 'google') {
        provider = new GmailProvider(accessToken, refreshToken);
      } else if (account.provider === 'outlook') {
        provider = new OutlookProvider(accessToken);
      } else {
        throw new Error('Provider not supported');
      }

      const limit = user?.plan === 'FREE' ? 500 : 1000;
      log(`Connecting to provider...`);
      await provider.connect();
      
      log(`Listing emails (HistoryID: ${account.last_history_id}, DeltaToken: ${account.delta_token ? 'Yes' : 'No'})...`);
      // Pass tokens for delta sync
      const { emails, nextHistoryId, nextDeltaToken } = await provider.listEmails({ 
        limit,
        historyId: account.last_history_id || undefined,
        deltaToken: account.delta_token || undefined
      });
      
      log(`Fetched ${emails.length} emails. Next History ID: ${nextHistoryId}, Next Delta Token: ${nextDeltaToken ? 'Yes' : 'No'}`);

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
          log(`Error saving batch: ${JSON.stringify(error)}`);
          console.error('Error saving batch:', error);
        }
      }

      // Update account with new history ID (Gmail)
      if (nextHistoryId) {
        log(`Updating history ID to ${nextHistoryId}`);
        const { error: updateError } = await supabase.from('email_accounts').update({
          last_history_id: nextHistoryId,
          updated_at: new Date().toISOString(),
        }).eq('id', accountId);
        
        if (updateError) log(`Error updating history ID: ${JSON.stringify(updateError)}`);
      }

      // Update account with new delta token (Outlook)
      if (nextDeltaToken) {
        log(`Updating delta token`);
        const { error: updateError } = await supabase.from('email_accounts').update({
          delta_token: nextDeltaToken,
          updated_at: new Date().toISOString(),
        }).eq('id', accountId);
        
        if (updateError) log(`Error updating delta token: ${JSON.stringify(updateError)}`);
      }
      
      log(`Sync complete for ${accountId}`);
    } catch (error) {
      const fs = await import('fs');
      const path = await import('path');
      try {
        fs.appendFileSync(path.join(process.cwd(), 'sync_debug.log'), `[${new Date().toISOString()}] CRITICAL ERROR: ${error}\n`);
      } catch {}
      console.error('SyncEngine Error:', error);
      throw error;
    }
  }
}
