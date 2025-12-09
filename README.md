
<div align="center">
  <img src="public/logo.png" alt="InboxOS Logo" width="120" />
  <h1>InboxOS</h1>
  <p><strong>Your Inbox, Reimagined. Intelligent. Private. Fast.</strong></p>
  
  <p>
    <a href="#-features">Features</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-deployment">Deployment</a>
  </p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-14-black" alt="Next.js" />
    <img src="https://img.shields.io/badge/Supabase-Postgres-green" alt="Supabase" />
    <img src="https://img.shields.io/badge/TypeScript-5.0-blue" alt="TypeScript" />
    <img src="https://img.shields.io/badge/License-MIT-purple" alt="License" />
  </div>
</div>

<br />

## 🚀 Overview

**InboxOS** is a next-generation email client designed for power users who want to reclaim their attention. Unlike traditional clients that just display emails, InboxOS acts as an operating system for your communications, using intelligent local processing to organize, filter, and prioritize your life.

Built with a **Privacy First** architecture, your data is synced to *your* private Supabase database, giving you complete ownership and control. No third-party servers reading your emails.

## ✨ Features

### 🧠 Intelligent Automation
*   **Focus Mode**: A distraction-free view that hides newsletters, receipts, and automated updates. It uses header analysis to surface only personal, human-to-human communication.
*   **Auto-Archive Rules**: Create powerful logic (e.g., "If sender is `recruiter` and subject contains `job`, then `Archive`").
*   **Smart Labels**: The local intelligence engine categorizes emails into **Finance**, **Travel**, **Social**, **Updates**, and **Promotions** without sending data to external AI APIs.

### 🧹 Inbox Zero Tools
*   **Newsletter Manager**: A dedicated dashboard to view all active subscriptions. Sort by volume and **Unsubscribe** or **Archive All** with a single click.
*   **Deep Clean**: The Duplicate Finder algorithm identifies redundant email threads and clutter.
*   **Trash Manager**: Live view of your email provider's trash folder. Permanently delete items or restore them if needed.
*   **Storage Manager**: Visualize your storage usage and delete large attachments (>10MB) instantly.

### 📊 Analytics & Insights
*   **Real-Time Dashboard**: Watch your stats update live as emails sync. Powered by Supabase Realtime.
*   **Category Distribution**: Visual breakdown of your inbox (Finance, Travel, Social, etc.).
*   **Sender Scorecards**: Discover who is spamming you the most with a ranked list.
*   **Volume Trends**: Beautiful area charts powered by `recharts` show your incoming email velocity.

### 🛡️ Enterprise-Grade Security
*   **Encryption**: Access tokens and refresh tokens are encrypted at rest using AES-256-GCM.
*   **Row Level Security (RLS)**: Supabase policies ensure strict data isolation between users.
*   **OAuth 2.0**: Secure integration with Gmail and Outlook using official APIs.

## 🏗️ Architecture

InboxOS uses a hybrid syncing architecture to balance performance and freshness.

1.  **The Sync Engine**: A custom Typescript worker (`core/engine/sync.ts`) runs on-demand. It connects to Gmail/Outlook APIs, fetches the latest changes (Delta Sync), and upserts them into your Postgres database.
2.  **The Intelligence Layer**: Before saving, emails pass through the `Classifier` (`core/intelligence/classifier.ts`) which applies heuristic rules and user-defined logic.
3.  **The Interface**: Next.js 14 (App Router) serves the dashboard, fetching data instantly from Supabase via React Query for a snappy experience.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS, Shadcn UI, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **State Management**: Tanstack Query (React Query)
- **Email Providers**: Gmail API (Google Cloud), Microsoft Graph API (Azure)
- **Payments**: Stripe / Paddle Integration (Ready)

## 🚦 Getting Started

### Prerequisites

*   **Node.js 18+**
*   **Supabase Project** (Free Tier works great)
*   **Google Cloud Project** (Enabled Gmail API + OAuth Screen)
*   **Azure App Registration** (Enabled Microsoft Graph Permissions)

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Security (Generate a random 32-char string)
ENCRYPTION_KEY=your-32-char-random-string

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Outlook OAuth
AZURE_CLIENT_ID=your-azure-client-id
AZURE_CLIENT_SECRET=your-azure-client-secret
```

### Database Setup

Run the SQL scripts located in `supabase/` to set up your schema:
1.  `schema.sql` (Base tables)
2.  `supabase_rules.sql` (Automation rules)
3.  `supabase_smart_labels.sql` (Classifications)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## � Deployment

### Database (Supabase)
Your database is hosted on Supabase. Ensure you apply the RLS policies in production.

### Frontend & API (Vercel)
The easiest way to deploy is Vercel.
1.  Push your code to GitHub.
2.  Import project into Vercel.
3.  Add all Environment Variables from `.env.local`.
4.  Deploy!

### Limitations (V1)
*   **Sync Limit**: Free users are limited to 500 emails per sync to conserve API quota.
*   **Provider Trash**: Deletes are permanent and move items to the provider's trash folder.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built by Hardik Sharma</p>
</div>
