import Link from "next/link"
import { ArrowLeft, Book } from "lucide-react"

export default function FeaturesDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link href="/docs" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Docs</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:px-6 max-w-3xl">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Book className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter">Features Guide</h1>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-xl text-muted-foreground">
              Explore the powerful features that make InboxOS the ultimate email cleaner.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Smart Filtering</h2>
            <p>
              InboxOS automatically categorizes your emails to help you focus on what matters.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Newsletters:</strong> Automatically identifies and groups newsletters.</li>
              <li><strong>Social Updates:</strong> Separates notifications from social media platforms.</li>
              <li><strong>Promotions:</strong> Keeps marketing emails out of your primary view.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Bulk Actions</h2>
            <p>
              Clean up thousands of emails in seconds with our bulk action tools.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Bulk Archive:</strong> Archive all emails older than a certain date.</li>
              <li><strong>Bulk Delete:</strong> Permanently remove unwanted emails from specific senders.</li>
              <li><strong>Unsubscribe:</strong> One-click unsubscribe from newsletters you no longer read.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Unified Inbox</h2>
            <p>
              Manage all your email accounts in one place.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Multi-Provider Support:</strong> Connect unlimited Gmail and Outlook accounts (based on your plan).</li>
              <li><strong>Unified Search:</strong> Search across all your inboxes instantly.</li>
              <li><strong>Cross-Account Actions:</strong> Apply rules and filters across all connected accounts.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Analytics & Insights</h2>
            <p>
              Get insights into your email habits.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Volume Trends:</strong> See when you receive the most email.</li>
              <li><strong>Top Senders:</strong> Identify who is clogging up your inbox.</li>
              <li><strong>Time Saved:</strong> Track how much time InboxOS has saved you.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
