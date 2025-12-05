"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Mail, ShieldAlert, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface AddAccountDialogProps {
  currentCount: number
  maxInboxes: number
  plan: string
}

export function AddAccountDialog({ currentCount, maxInboxes, plan }: AddAccountDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const isLimitReached = currentCount >= maxInboxes
  const supabase = createClient()

  const handleConnect = async (provider: 'google' | 'azure') => {
    setIsLoading(provider)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${location.origin}/api/auth/callback?next=/dashboard/account&action=connect`,
          scopes: provider === 'google' 
            ? 'openid profile email https://www.googleapis.com/auth/gmail.readonly' 
            : 'openid profile email Mail.Read offline_access',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      if (error) {
        console.error(error)
        setIsLoading(null)
      }
    } catch (error) {
      console.error(error)
      setIsLoading(null)
    }
  }

  const providers = [
    {
      id: "google",
      name: "Gmail",
      icon: "/logos/google.svg",
      description: "Connect your Google Workspace or Gmail account",
      action: () => handleConnect('google'),
    },
    {
      id: "outlook",
      name: "Outlook",
      icon: "/logos/outlook.svg",
      description: "Connect your Microsoft Outlook or Office 365 account",
      action: () => handleConnect('azure'),
    },
    {
      id: "imap",
      name: "IMAP",
      icon: null,
      description: "Connect any other email provider via IMAP",
      action: () => {},
      disabled: true,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={cn("gap-2", isLimitReached && "opacity-50 cursor-not-allowed")} disabled={isLimitReached}>
          <Plus className="h-4 w-4" />
          Add Inbox
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Connect an Inbox</DialogTitle>
          <DialogDescription>
            Choose an email provider to connect to InboxOS.
          </DialogDescription>
        </DialogHeader>

        {isLimitReached ? (
          <div className="rounded-md bg-amber-50 p-4 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900">
            <div className="flex">
              <div className="flex-shrink-0">
                <ShieldAlert className="h-5 w-5 text-amber-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Plan Limit Reached
                </h3>
                <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                  <p>
                    You have reached the limit of {maxInboxes} connected inbox{maxInboxes !== 1 && 'es'} on your {plan} plan.
                  </p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <Link href="/pricing">
                      <Button variant="ghost" size="sm" className="text-amber-800 hover:bg-amber-100 dark:text-amber-100 dark:hover:bg-amber-900">
                        Upgrade Plan <span aria-hidden="true">&rarr;</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 py-4 md:grid-cols-3">
            {providers.map((provider) => (
              <div 
                key={provider.id} 
                onClick={provider.disabled || isLoading ? undefined : provider.action}
                className={cn(
                  "relative",
                  (provider.disabled || isLoading) && "pointer-events-none opacity-50"
                )}
              >
                <Card className="flex flex-col items-center justify-center gap-4 p-6 hover:bg-muted/50 transition-colors cursor-pointer h-full text-center">
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-background border shadow-sm">
                    {isLoading === provider.id ? (
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : provider.icon ? (
                      <Image 
                        src={provider.icon} 
                        alt={provider.name} 
                        width={24} 
                        height={24} 
                        className="h-6 w-6"
                      />
                    ) : (
                      <Mail className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium leading-none">{provider.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {provider.id === 'imap' ? 'Coming Soon' : 'OAuth 2.0'}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
