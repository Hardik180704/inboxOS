import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Authentication Error</h1>
        <p className="text-muted-foreground">
          There was a problem signing you in. Please try again.
        </p>
      </div>
      <Button asChild>
        <Link href="/login">Back to Login</Link>
      </Button>
    </div>
  )
}
