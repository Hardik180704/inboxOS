export interface Email {
  id: string; // Remote ID
  subject: string;
  snippet: string;
  sender: {
    name: string;
    address: string;
  };
  date: Date;
  headers: Record<string, string>;
  body?: string;
  bodyHtml?: string;
  sizeEstimate?: number;
  hasAttachments?: boolean;
}

export interface FetchOptions {
  limit?: number;
  pageToken?: string;
  query?: string;
  historyId?: string; // For Gmail delta sync
  deltaToken?: string; // For Outlook delta sync
}

export interface SyncResult {
  emails: Email[];
  nextHistoryId?: string;
  nextDeltaToken?: string;
}

export interface EmailProvider {
  connect(): Promise<void>;
  listEmails(options: FetchOptions): Promise<SyncResult>;
  getHeaders(remoteId: string): Promise<Record<string, string>>;
  archive(remoteIds: string[]): Promise<void>;
  delete(remoteIds: string[]): Promise<void>;
  unsubscribe(remoteId: string): Promise<void>;
}
