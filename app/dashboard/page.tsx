"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/providers/auth-provider"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { Loader2, RefreshCw, Mail, Calendar, Glasses } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import DOMPurify from "isomorphic-dompurify"
import { useState } from "react"
import { FocusToggle } from "@/components/dashboard/focus-toggle"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Badge } from "@/components/ui/badge"

function getCategoryColor(category?: string) {
  switch (category) {
    case 'finance': return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
    case 'travel': return 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800'
    case 'social': return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
    case 'updates': return 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800'
    case 'promotions': return 'bg-pink-500/15 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-800'
    case 'primary': return 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
    default: return 'bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800'
  }
}

interface DashboardStats {
  totalEmails: number
  newsletters: number
  storageSaved: number
  recentEmails: any[]
}

import { Suspense } from "react"

function DashboardPageContent() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null)
  const [isFocusMode, setIsFocusMode] = useLocalStorage('focus-mode', false)

  const { data: selectedEmail, isLoading: isLoadingEmail } = useQuery({
    queryKey: ['email', selectedEmailId],
    queryFn: async () => {
      if (!selectedEmailId) return null
      const res = await fetch(`/api/emails/${selectedEmailId}`)
      if (!res.ok) throw new Error('Failed to fetch email')
      return res.json()
    },
    enabled: !!selectedEmailId,
  })

  const searchParams = useSearchParams()
  const inboxId = searchParams.get('inboxId')

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats', inboxId],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (inboxId) params.set('accountId', inboxId)
      
      const res = await fetch(`/api/stats?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch stats')
      return res.json()
    },
    enabled: !!user,
  })

  const syncMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/sync', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to sync')
      return res.json()
    },
    onSuccess: (data) => {
      if (data.results && data.results.length > 0) {
        const successCount = data.results.filter((r: any) => r.status === 'success').length
        const failCount = data.results.length - successCount
        
        if (successCount > 0) toast.success(`Synced ${successCount} account(s)`)
        if (failCount > 0) toast.error(`Failed to sync ${failCount} account(s)`)
      } else {
        toast.info(data.message || 'Sync completed')
      }
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
    onError: () => {
      toast.error('Failed to start sync')
    }
  })

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }



  const dashboardEmails = stats?.recentEmails || []
  const filteredEmails = isFocusMode
    ? dashboardEmails.filter((email: any) => !email.metadata?.list_unsubscribe)
    : dashboardEmails

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Statistics Cards - Unchanged */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEmails || 0}</div>
            <p className="text-xs text-muted-foreground">
              Across all connected accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletters</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.newsletters || 0}</div>
            <p className="text-xs text-muted-foreground">
              Identified newsletters
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Saved</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.storageSaved || 0} MB</div>
            <p className="text-xs text-muted-foreground">
              From deleted emails
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
           <h2 className="text-lg font-semibold">Your Mails</h2>
           <FocusToggle isFocusMode={isFocusMode} onToggle={setIsFocusMode} />
        </div>
        <Button 
          onClick={() => syncMutation.mutate()} 
          disabled={syncMutation.isPending}
          className="w-full sm:w-auto"
        >
          {syncMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Inbox
            </>
          )}
        </Button>
      </div>

      <div className="rounded-md border">
        {filteredEmails.length > 0 ? (
          <ScrollArea className="h-[400px]">
            <div className="divide-y">
              {filteredEmails.map((email: any) => (
                <div 
                  key={email.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors gap-2"
                  onClick={() => setSelectedEmailId(email.id)}
                >
                  <div className="grid gap-1 min-w-0 flex-1">
                    <div className="font-medium flex items-center gap-2 flex-wrap">
                       <span className="truncate">{email.subject || '(No Subject)'}</span>
                       {email.category && (
                         <Badge variant="outline" className={`shrink-0 ${getCategoryColor(email.category)}`}>
                           {email.category}
                         </Badge>
                       )}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {email.sender_name || email.sender_address}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground shrink-0">
                    <Calendar className="mr-2 h-4 w-4" />
                    {formatDistanceToNow(new Date(email.received_at), { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            {isFocusMode ? (
               <>
                 <Glasses className="mx-auto h-8 w-8 text-indigo-500 mb-2" />
                 <p>Focus Mode On. No important personal emails found.</p>
               </>
            ) : (
               <p>No emails found. Connect an account and sync to get started.</p>
            )}
          </div>
        )}
      </div>

      <Dialog open={!!selectedEmailId} onOpenChange={(open) => !open && setSelectedEmailId(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedEmail?.subject || '(No Subject)'}</DialogTitle>
            <DialogDescription>
              From: {selectedEmail?.sender_name} &lt;{selectedEmail?.sender_address}&gt;
              <br />
              Received: {selectedEmail?.received_at && new Date(selectedEmail.received_at).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {isLoadingEmail ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div 
                className="prose dark:prose-invert max-w-none text-sm"
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(selectedEmail?.body_html || selectedEmail?.body || 'No content') 
                }} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <DashboardPageContent />
    </Suspense>
  )
}
