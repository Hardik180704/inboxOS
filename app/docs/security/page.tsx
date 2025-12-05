import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"

export default function SecurityDocsPage() {
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
              <Shield className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter">Security & Privacy</h1>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-xl text-muted-foreground">
              Your security is our top priority. Here&apos;s how we protect your data.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Data Encryption</h2>
            <p>
              All data transmitted between your browser and our servers is encrypted using TLS 1.2 or higher. 
              Sensitive data at rest, such as access tokens, is encrypted using AES-256 encryption.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">OAuth & Permissions</h2>
            <p>
              We use OAuth 2.0 to connect to your email providers (Google and Microsoft). This means:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>We <strong>never</strong> see or store your email password.</li>
              <li>You can revoke our access at any time from your Google or Microsoft account settings.</li>
              <li>We only request the specific permissions needed to perform our services (reading and managing emails).</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Data Retention & Deletion</h2>
            <p>
              We believe in data minimization. We only store metadata necessary to provide our service.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Email Bodies:</strong> We fetch email bodies on-demand and cache them temporarily for performance.</li>
              <li><strong>Account Deletion:</strong> If you delete your account, all your data is permanently removed from our servers immediately.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Compliance</h2>
            <p>
              We adhere to strict security practices and regularly audit our systems to ensure compliance with industry standards.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
