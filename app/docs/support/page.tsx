import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"

export default function SupportDocsPage() {
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
              <Mail className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter">Support</h1>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-xl text-muted-foreground">
              Having trouble? We&apos;re here to help you get back on track.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Troubleshooting Common Issues</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-2">Sync Not Working</h3>
            <p>
              If your emails aren&apos;t syncing:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Check your internet connection.</li>
              <li>Try refreshing the dashboard page.</li>
              <li>Go to <strong>Settings &gt; Account</strong> and try reconnecting your account.</li>
              <li>If the issue persists, remove the account and add it again.</li>
            </ol>

            <h3 className="text-xl font-semibold mt-6 mb-2">Login Issues</h3>
            <p>
              If you can&apos;t log in:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Ensure you are using the correct email address.</li>
              <li>Check if third-party cookies are enabled in your browser.</li>
              <li>Try clearing your browser cache and cookies.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Billing & Subscriptions</h2>
            <p>
              For billing inquiries, please visit the <strong>Settings &gt; Billing</strong> page in your dashboard. 
              You can view your invoices, update payment methods, or change your plan there.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
            <p>
              If you can&apos;t find the answer you&apos;re looking for, please contact our support team directly.
            </p>
            
            <div className="mt-6 p-6 bg-muted rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Email Support</h3>
              <p className="text-muted-foreground mb-4">
                We aim to respond to all inquiries within 24 hours.
              </p>
              <Button asChild>
                <a href="mailto:inboxos2004@gmail.com">Email inboxos2004@gmail.com</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
