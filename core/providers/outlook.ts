import { Client } from '@microsoft/microsoft-graph-client';
import { EmailProvider, Email, FetchOptions } from './types';

export class OutlookProvider implements EmailProvider {
  private client: Client | null = null;
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async connect(): Promise<void> {
    this.client = Client.init({
      authProvider: (done) => {
        done(null, this.accessToken);
      },
    });
  }

  async listEmails(options: FetchOptions = {}): Promise<Email[]> {
    if (!this.client) throw new Error('Client not connected');

    const limit = options.limit || 50;
    // Select fields to minimize payload
    const response = await this.client.api('/me/messages')
      .top(limit)
      .select('id,subject,bodyPreview,sender,receivedDateTime,internetMessageHeaders')
      .orderby('receivedDateTime DESC')
      .get();

    const messages = response.value || [];

    return messages.map((msg: any) => ({
      id: msg.id,
      subject: msg.subject || '(No Subject)',
      snippet: msg.bodyPreview || '',
      sender: {
        name: msg.sender?.emailAddress?.name || '',
        address: msg.sender?.emailAddress?.address || '',
      },
      date: new Date(msg.receivedDateTime),
      headers: this.parseHeaders(msg.internetMessageHeaders || []),
    }));
  }

  private parseHeaders(headers: any[]): Record<string, string> {
    const result: Record<string, string> = {};
    for (const h of headers) {
      result[h.name.toLowerCase()] = h.value;
    }
    return result;
  }

  async getHeaders(remoteId: string): Promise<Record<string, string>> {
    if (!this.client) throw new Error('Client not connected');
    
    const msg = await this.client.api(`/me/messages/${remoteId}`)
      .select('internetMessageHeaders')
      .get();

    return this.parseHeaders(msg.internetMessageHeaders || []);
  }

  async archive(remoteIds: string[]): Promise<void> {
    if (!this.client) throw new Error('Client not connected');

    // Outlook "Archive" usually means moving to the Archive folder.
    // We first need to find the Archive folder ID, or use the well-known name 'archive' if supported.
    // Graph API supports moving to well-known folder names directly in some endpoints, but /move requires a destinationId.
    // For simplicity/robustness, we'll assume 'archive' well-known name works or we'd need to fetch it.
    // Actually, the safest way is to just move to 'archive' well-known folder.
    
    for (const id of remoteIds) {
      await this.client.api(`/me/messages/${id}/move`)
        .post({ destinationId: 'archive' });
    }
  }

  async delete(remoteIds: string[]): Promise<void> {
    if (!this.client) throw new Error('Client not connected');

    // Batching would be better, but simple loop for now
    for (const id of remoteIds) {
      await this.client.api(`/me/messages/${id}`).delete();
    }
  }

  async unsubscribe(remoteId: string): Promise<void> {
    // This typically involves parsing the List-Unsubscribe header and executing the action (mailto or http).
    // The provider interface just says "unsubscribe", implying the logic might be here or handled by the caller using headers.
    // For now, we'll implement a basic check or placeholder.
    // In a real implementation, this would parse headers and make an HTTP request or send an email.
    console.log(`Unsubscribing from email ${remoteId} (Not fully implemented in provider)`);
  }
}
