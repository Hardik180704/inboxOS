import { google } from 'googleapis';
import { EmailProvider, FetchOptions, Email } from './types';
import { OAuth2Client } from 'google-auth-library';

export class GmailProvider implements EmailProvider {
  private client: OAuth2Client;
  private gmail: any;

  constructor(accessToken: string, refreshToken: string) {
    this.client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    this.client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    this.gmail = google.gmail({ version: 'v1', auth: this.client });
  }

  async connect(): Promise<void> {
    // Verify connection by getting profile
    await this.gmail.users.getProfile({ userId: 'me' });
  }

  async listEmails(options: FetchOptions): Promise<Email[]> {
    const res = await this.gmail.users.messages.list({
      userId: 'me',
      maxResults: options.limit || 50,
      pageToken: options.pageToken,
      q: options.query,
    });

    const messages = res.data.messages || [];
    const emails: Email[] = [];

    // Batch fetch details
    // Note: In production, use batch API or parallel requests with limit
    for (const msg of messages) {
      if (!msg.id) continue;
      const detail = await this.gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'metadata',
        metadataHeaders: ['Subject', 'From', 'Date', 'List-Unsubscribe'],
      });

      const headers: Record<string, string> = {};
      detail.data.payload?.headers?.forEach((h: any) => {
        headers[h.name] = h.value;
      });

      emails.push({
        id: msg.id,
        subject: headers['Subject'] || '(No Subject)',
        snippet: detail.data.snippet || '',
        sender: this.parseSender(headers['From'] || ''),
        date: new Date(headers['Date'] || Date.now()),
        headers: headers,
      });
    }

    return emails;
  }

  async getHeaders(remoteId: string): Promise<Record<string, string>> {
    const detail = await this.gmail.users.messages.get({
      userId: 'me',
      id: remoteId,
      format: 'metadata',
    });
    const headers: Record<string, string> = {};
    detail.data.payload?.headers?.forEach((h: any) => {
      headers[h.name] = h.value;
    });
    return headers;
  }

  async archive(remoteIds: string[]): Promise<void> {
    await this.gmail.users.messages.batchModify({
      userId: 'me',
      requestBody: {
        ids: remoteIds,
        removeLabelIds: ['INBOX'],
      },
    });
  }

  async delete(remoteIds: string[]): Promise<void> {
    await this.gmail.users.messages.batchDelete({
      userId: 'me',
      requestBody: {
        ids: remoteIds,
      },
    });
  }

  async unsubscribe(remoteId: string): Promise<void> {
    // Basic implementation: Check List-Unsubscribe header
    // This is complex and requires parsing mailto/http links
    // For now, placeholder
    console.log('Unsubscribing from', remoteId);
  }

  private parseSender(from: string): { name: string; address: string } {
    // Example: "Google <no-reply@accounts.google.com>"
    const match = from.match(/(.*)<(.*)>/);
    if (match) {
      return { name: match[1].trim().replace(/^"|"$/g, ''), address: match[2].trim() };
    }
    return { name: '', address: from.trim() };
  }
}
