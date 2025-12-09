"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, Copy, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CleanPage() {
  const queryClient = useQueryClient()

  const { data: duplicates, isLoading } = useQuery({
    queryKey: ['duplicates'],
    queryFn: async () => {
      const res = await fetch('/api/clean/duplicates')
      if (!res.ok) throw new Error('Failed to fetch duplicates')
      return res.json()
    }
  })

  const cleanMutation = useMutation({
    mutationFn: async (groups: any[]) => {
      const res = await fetch('/api/clean/duplicates', {
        method: 'POST',
        body: JSON.stringify({ action: 'clean', groups })
      })
      if (!res.ok) throw new Error('Action failed')
      return res.json()
    },
    onSuccess: (_, variables) => {
      toast.success('Cleaned duplicates')
      
      // Optimistically remove cleaned groups from cache
      queryClient.setQueryData(['duplicates'], (oldData: any[]) => {
        if (!oldData) return []
        // variables is the array of groups we sent to be cleaned
        // We can filter out groups that matched the subject/sender of the payload
        // Actually, variables is precisely the groups array.
        // If we cleaned specific groups, we remove them.
        // If we cleaned ALL (passed duplicates array), we empty it.
        
        // Simple heuristic: 
        // If variables === oldData (reference check might fail but length might match), we clear all.
        // Better: filtering.
        
        const cleanedSubjects = new Set(variables.map((g: any) => g.subject))
        return oldData.filter((g: any) => !cleanedSubjects.has(g.subject))
      })

      queryClient.invalidateQueries({ queryKey: ['duplicates'] })
    },
    onError: () => {
      toast.error('Failed to clean duplicates')
    }
  })

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const handleCleanAll = () => {
    if (!duplicates?.length) return
    cleanMutation.mutate(duplicates)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Deep Clean</h1>
        <p className="text-muted-foreground">
          Remove redundant duplicate emails to declutter your inbox.
        </p>
      </div>

      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertTitle>How it works</AlertTitle>
        <AlertDescription>
          We find emails with matching subject, sender, and time (within 1 min). "Clean All" keeps the newest copy and deletes the rest.
        </AlertDescription>
      </Alert>

      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">
            Found {duplicates?.length || 0} groups of duplicates
        </div>
        <Button 
            onClick={handleCleanAll} 
            disabled={!duplicates?.length || cleanMutation.isPending}
        >
            {cleanMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Clean All
        </Button>
      </div>

      <div className="grid gap-4">
        {duplicates?.map((group: any, i: number) => (
          <Card key={i}>
            <div className="flex items-center justify-between p-6">
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{group.subject || '(No Subject)'}</h3>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full dark:bg-red-900 dark:text-red-200">
                    {group.count} copies
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sender: {group.sender}
                </p>
                <div className="text-xs text-muted-foreground mt-2 flex gap-4">
                    {group.emails.map((e: any) => (
                        <span key={e.id}>{formatDistanceToNow(new Date(e.received_at), { addSuffix: true })}</span>
                    ))}
                </div>
              </div>
              <Button 
                variant="outline"
                onClick={() => cleanMutation.mutate([group])}
                disabled={cleanMutation.isPending}
              >
                Merge
              </Button>
            </div>
          </Card>
        ))}

        {duplicates?.length === 0 && (
          <div className="text-center py-12 border rounded-lg border-dashed">
            <Copy className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No Duplicates Found</h3>
            <p className="text-muted-foreground">Your inbox is squeaky clean!</p>
          </div>
        )}
      </div>
    </div>
  )
}
