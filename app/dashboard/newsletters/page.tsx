"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, Mail, Trash2, Ban, Search, Zap, BarChart } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function NewslettersPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')

  const { data: newsletters, isLoading } = useQuery({
    queryKey: ['newsletters'],
    queryFn: async () => {
      const res = await fetch('/api/newsletters')
      if (!res.ok) throw new Error('Failed to fetch newsletters')
      return res.json()
    }
  })

  const actionMutation = useMutation({
    mutationFn: async ({ action, sender, id, accountId }: { action: 'unsubscribe' | 'archive_all', sender: string, id: string, accountId: string }) => {
      const res = await fetch('/api/newsletters', {
        method: 'POST',
        body: JSON.stringify({ action, sender_address: sender, sample_remote_id: id, account_id: accountId })
      })
      if (!res.ok) throw new Error('Action failed')
      return res.json()
    },
    onSuccess: (_, variables) => {
      toast.success(variables.action === 'unsubscribe' ? 'Unsubscribed successfully' : 'Archived all emails from sender')
      queryClient.invalidateQueries({ queryKey: ['newsletters'] })
    },
    onError: () => {
      toast.error('Failed to perform action')
    }
  })

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const sortedNewsletters = newsletters?.sort((a: any, b: any) => b.count - a.count) || []
  const totalEmails = newsletters?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0
  const topSender = sortedNewsletters[0]

  const filteredNewsletters = sortedNewsletters.filter((n: any) => 
    (n.sender_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
    n.sender_address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Newsletter Manager</h1>
          <p className="text-muted-foreground">
            Identify and manage your subscriptions. Unsubscribe or clean up in one click.
          </p>
        </div>
        <div className="w-full md:w-auto">
            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search senders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full md:w-[250px]"
                />
            </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newsletters?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Unique senders identified</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmails}</div>
            <p className="text-xs text-muted-foreground">Newsletter emails found</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Distraction</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate text-clip" title={topSender?.sender_name || topSender?.sender_address}>
                {topSender ? (topSender.sender_name || topSender.sender_address).slice(0, 15) + (topSender.sender_name?.length > 15 ? '...' : '') : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
                {topSender ? `${topSender.count} emails sent` : 'No data yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {filteredNewsletters.map((newsletter: any) => (
          <Card key={newsletter.sender_address}>
            <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div className="grid gap-1 w-full min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-lg truncate">{newsletter.sender_name || newsletter.sender_address}</h3>
                  <Badge variant={newsletter.count > 10 ? "destructive" : "secondary"}>
                    {newsletter.count} emails
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {newsletter.sender_address} • Last received {formatDistanceToNow(new Date(newsletter.latest_received_at), { addSuffix: true })}
                </p>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex-1 md:flex-none"
                  onClick={() => actionMutation.mutate({ 
                    action: 'archive_all', 
                    sender: newsletter.sender_address,
                    id: newsletter.sample_remote_id, 
                    accountId: newsletter.account_id 
                  })}
                  disabled={actionMutation.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Archive All
                </Button>
                <Button 
                  variant="destructive"
                  size="sm"
                  className="flex-1 md:flex-none"
                  onClick={() => actionMutation.mutate({ 
                    action: 'unsubscribe', 
                    sender: newsletter.sender_address,
                    id: newsletter.sample_remote_id, 
                    accountId: newsletter.account_id 
                  })}
                  disabled={actionMutation.isPending}
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Unsubscribe
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {sortedNewsletters.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No newsletters detected yet. Try syncing your inbox again.
          </div>
        )}
      </div>
    </div>
  )
}
