import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Book, Shield, Zap, Mail, LayoutDashboard } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="InboxOS Logo" className="h-8 w-8 object-contain" />
              <span className="text-lg font-bold tracking-tighter text-foreground">InboxOS Docs</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:px-6 max-w-4xl">
        <div className="space-y-12">
          <section className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter">Documentation</h1>
            <p className="text-xl text-muted-foreground">
              Learn how to integrate, manage, and optimize your email workflow with InboxOS.
            </p>
          </section>

          <div className="grid gap-8 md:grid-cols-2">
            <Link href="/docs/getting-started" className="block group">
              <div className="space-y-4 rounded-lg border p-6 shadow-sm transition-all group-hover:border-primary/50 group-hover:shadow-md h-full">
                <div className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Getting Started</h2>
                </div>
                <p className="text-muted-foreground">
                  Connect your first inbox and start cleaning up your email in minutes.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Connecting Gmail & Outlook</li>
                  <li>Understanding the Dashboard</li>
                  <li>Setting up your profile</li>
                </ul>
              </div>
            </Link>

            <Link href="/docs/security" className="block group">
              <div className="space-y-4 rounded-lg border p-6 shadow-sm transition-all group-hover:border-primary/50 group-hover:shadow-md h-full">
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Security & Privacy</h2>
                </div>
                <p className="text-muted-foreground">
                  Learn how we protect your data and ensure your privacy.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Data Encryption Standards</li>
                  <li>OAuth & Permissions</li>
                  <li>Data Deletion Policy</li>
                </ul>
              </div>
            </Link>

            <Link href="/docs/features" className="block group">
              <div className="space-y-4 rounded-lg border p-6 shadow-sm transition-all group-hover:border-primary/50 group-hover:shadow-md h-full">
                <div className="flex items-center gap-2">
                  <Book className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Features Guide</h2>
                </div>
                <p className="text-muted-foreground">
                  Deep dive into InboxOS features and capabilities.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Smart Filtering</li>
                  <li>Bulk Actions</li>
                  <li>Analytics & Insights</li>
                </ul>
              </div>
            </Link>

            <Link href="/docs/support" className="block group">
              <div className="space-y-4 rounded-lg border p-6 shadow-sm transition-all group-hover:border-primary/50 group-hover:shadow-md h-full">
                <div className="flex items-center gap-2">
                  <Mail className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Support</h2>
                </div>
                <p className="text-muted-foreground">
                  Need help? We&apos;re here for you.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Troubleshooting Sync Issues</li>
                  <li>Billing & Subscriptions</li>
                  <li>Contacting Support</li>
                </ul>
              </div>
            </Link>
          </div>

          <section className="space-y-4 pt-8 border-t">
            <h2 className="text-2xl font-bold">Still have questions?</h2>
            <p className="text-muted-foreground">
              Our support team is available to help you with any issues or questions you might have.
            </p>
            <Button asChild>
              <a href="mailto:inboxos2004@gmail.com">Contact Support</a>
            </Button>
          </section>
        </div>
      </main>
    </div>
  )
}
