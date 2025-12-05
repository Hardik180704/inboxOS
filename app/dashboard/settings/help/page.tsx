"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, FileText, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Help & Support</h3>
        <p className="text-sm text-muted-foreground">
          Get help with InboxOS.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle>Contact Support</CardTitle>
            </div>
            <CardDescription>
              Need help? Reach out to our support team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Email us directly at:
            </p>
            <a href="mailto:inboxos2004@gmail.com" className="text-primary font-medium hover:underline">
              inboxos2004@gmail.com
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Documentation</CardTitle>
            </div>
            <CardDescription>
              Read our guides and documentation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Learn how to get the most out of InboxOS.
            </p>
            <Link href="/docs" className="text-primary font-medium hover:underline">
              View Documentation &rarr;
            </Link>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <CardTitle>Frequently Asked Questions</CardTitle>
            </div>
            <CardDescription>
              Quick answers to common questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm">How do I connect a new inbox?</h4>
              <p className="text-sm text-muted-foreground">
                Go to the Account settings page and click &quot;Add Account&quot;. You can connect Gmail or Outlook accounts.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm">Is my data secure?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, we use industry-standard encryption to protect your data. We never store your password and only access emails you authorize.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm">How do I upgrade my plan?</h4>
              <p className="text-sm text-muted-foreground">
                Visit the Billing settings page to view available plans and upgrade your subscription.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
