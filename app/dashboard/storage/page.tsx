"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, Trash2, Paperclip, HardDrive } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"


export default function StoragePage() {
  const queryClient = useQueryClient()
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const { data: emails, isLoading } = useQuery({
    queryKey: ['storage-emails'],
    queryFn: async () => {
      const res = await fetch('/api/storage')
      if (!res.ok) throw new Error('Failed to fetch emails')
      return res.json()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await fetch('/api/storage', {
        method: 'POST',
        body: JSON.stringify({ action: 'trash', emailIds: ids })
      })
      if (!res.ok) throw new Error('Action failed')
      return res.json()
    },
    onSuccess: (_, variables) => {
      toast.success('Moved to trash')
      
      // Optimistically remove deleted items from cache
      queryClient.setQueryData(['storage-emails'], (oldData: any[]) => {
        if (!oldData) return []
        // variables is the array of IDs we sent to be deleted
        const deletedIds = new Set(variables)
        return oldData.filter((email: any) => !deletedIds.has(email.id))
      })

      setSelectedIds([])
      queryClient.invalidateQueries({ queryKey: ['storage-emails'] })
    },
    onError: () => {
      toast.error('Failed to move to trash')
    }
  })

  // Format bytes to legible string
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedIds.length === emails?.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(emails?.map((e: any) => e.id) || [])
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const totalSize = emails?.reduce((acc: number, curr: any) => acc + (curr.size_estimate || 0), 0) || 0
  const selectedSize = emails
    ?.filter((e: any) => selectedIds.includes(e.id))
    .reduce((acc: number, curr: any) => acc + (curr.size_estimate || 0), 0) || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Storage Manager</h1>
        <p className="text-muted-foreground">
          Find and delete large emails to free up cloud storage space.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reclaimable Space</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(totalSize)}</div>
            <p className="text-xs text-muted-foreground">From top 50 largest emails</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border bg-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b gap-4">
          <div className="flex items-center gap-2">
             <Checkbox 
                checked={emails?.length > 0 && selectedIds.length === emails?.length}
                onCheckedChange={toggleAll}
             />
             <span className="text-sm font-medium ml-2">Select All</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {selectedIds.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedIds.length} selected ({formatBytes(selectedSize)})
              </span>
            )}
            <Button 
              variant="destructive"
              size="sm"
              onClick={() => deleteMutation.mutate(selectedIds)}
              disabled={selectedIds.length === 0 || deleteMutation.isPending}
              className="w-full md:w-auto"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Trash Selected
            </Button>
          </div>
        </div>

        <div className="divide-y">
          {emails?.map((email: any) => (
            <div key={email.id} className="flex items-center p-4 hover:bg-muted/50 transition-colors group">
              <Checkbox 
                checked={selectedIds.includes(email.id)}
                onCheckedChange={() => toggleSelection(email.id)}
                className="mt-1 shrink-0"
              />
              <div className="ml-4 grid gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm truncate">{email.subject || '(No Subject)'}</span>
                  {email.has_attachments && <Paperclip className="h-3 w-3 text-muted-foreground shrink-0" />}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2 truncate">
                  <span className="truncate">{email.sender_name || email.sender_address}</span>
                  <span>•</span>
                  <span className="shrink-0">{formatDistanceToNow(new Date(email.received_at), { addSuffix: true })}</span>
                </div>
              </div>
              <div className="text-sm font-mono font-medium text-muted-foreground ml-4 shrink-0">
                {formatBytes(email.size_estimate)}
              </div>
            </div>
          ))}
          {emails?.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
               No large emails found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
