"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, Trash2, Mail, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { AddAccountDialog } from "./add-account-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { formatDistanceToNow } from "date-fns"

interface Account {
  id: string
  provider: 'google' | 'outlook' | 'imap'
  email_address: string
  created_at: string
  updated_at: string
}

interface AccountsResponse {
  accounts: Account[]
  plan: 'FREE' | 'PRO' | 'PREMIUM'
}

export function AccountList() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<AccountsResponse>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const res = await fetch('/api/accounts')
      if (!res.ok) throw new Error('Failed to fetch accounts')
      return res.json()
    },
  })

  const syncMutation = useMutation({
    mutationFn: async (accountId: string) => {
      const res = await fetch('/api/sync', {
        method: 'POST',
        body: JSON.stringify({ accountId }),
      })
      if (!res.ok) throw new Error('Failed to sync')
      return res.json()
    },
    onSuccess: () => {
      toast.success('Account synced successfully')
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
    onError: () => {
      toast.error('Failed to sync account')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (accountId: string) => {
      const res = await fetch(`/api/accounts/${accountId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete account')
      return res.json()
    },
    onSuccess: () => {
      toast.success('Account removed successfully')
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
    onError: () => {
      toast.error('Failed to remove account')
    }
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const accounts = data?.accounts || []
  const plan = data?.plan || 'FREE'
  
  const maxInboxes = plan === 'FREE' ? 1 : plan === 'PRO' ? 3 : Infinity

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return <Image src="/logos/google.svg" alt="Google" width={20} height={20} />
      case 'outlook':
        return <Image src="/logos/outlook.svg" alt="Outlook" width={20} height={20} />
      default:
        return <Mail className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Connected Inboxes</h3>
          <p className="text-sm text-muted-foreground">
            {accounts.length} / {maxInboxes === Infinity ? 'Unlimited' : maxInboxes} inboxes connected
            {plan !== 'PREMIUM' && (
              <span className="ml-2 text-xs font-medium text-primary">
                ({plan} Plan)
              </span>
            )}
          </p>
        </div>
        <AddAccountDialog 
          currentCount={accounts.length} 
          maxInboxes={maxInboxes} 
          plan={plan} 
        />
      </div>

      <div className="grid gap-4">
        {accounts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <Mail className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg">No inboxes connected</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-6">
                Connect your first email account to start organizing your inbox with AI.
              </p>
              <AddAccountDialog 
                currentCount={0} 
                maxInboxes={maxInboxes} 
                plan={plan} 
              />
            </CardContent>
          </Card>
        ) : (
          accounts.map((account) => (
            <Card key={account.id} className="overflow-hidden">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-muted">
                    {getProviderIcon(account.provider)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{account.email_address}</h4>
                      <Badge variant="outline" className="text-xs font-normal gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        Connected
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last synced {formatDistanceToNow(new Date(account.updated_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => syncMutation.mutate(account.id)}
                    disabled={syncMutation.isPending}
                  >
                    {syncMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    <span className="sr-only sm:not-sr-only sm:ml-2">Sync</span>
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove account?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove {account.email_address} from InboxOS. 
                          Your emails will remain in your provider, but we will stop syncing and organizing them.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteMutation.mutate(account.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
