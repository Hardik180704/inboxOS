import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Zap } from "lucide-react"

export default function GettingStartedPage() {
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
              <Zap className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter">Getting Started</h1>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-xl text-muted-foreground">
              Welcome to InboxOS! This guide will help you get up and running in minutes.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Connecting Your Email Accounts</h2>
            <p>
              InboxOS supports both Gmail and Outlook. To connect an account:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Go to your <strong>Dashboard</strong>.</li>
              <li>Click on the <strong>Account</strong> settings or the &quot;+&quot; icon in the sidebar.</li>
              <li>Select your provider (Google or Microsoft).</li>
              <li>Authorize InboxOS to access your emails.</li>
            </ol>
            <p className="mt-4 text-sm text-muted-foreground bg-muted p-4 rounded-lg">
              <strong>Note:</strong> We only request permissions necessary to read and manage your emails. We never store your password.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Understanding the Dashboard</h2>
            <p>
              Your dashboard is the command center for your email. Here&apos;s what you&apos;ll see:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Stats Overview:</strong> See how many emails you&apos;ve cleaned and how much time you&apos;ve saved.</li>
              <li><strong>Recent Emails:</strong> A unified view of emails from all your connected accounts.</li>
              <li><strong>Quick Actions:</strong> One-click buttons to clean newsletters, archive old threads, and more.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Setting Up Your Profile</h2>
            <p>
              Customize your experience in the <strong>Settings</strong> page. You can:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Update your display name and avatar.</li>
              <li>Choose your preferred theme (Light/Dark).</li>
              <li>Manage your subscription plan.</li>
            </ul>
          </div>

          <div className="pt-8 border-t">
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
