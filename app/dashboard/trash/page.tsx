"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { Trash2, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function TrashPage() {
  const { data: emails, isLoading } = useQuery({
    queryKey: ['trash'],
    queryFn: async () => {
      const res = await fetch('/api/trash')
      if (!res.ok) throw new Error('Failed to fetch trash')
      return res.json()
    }
  })

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trash</h1>
        <p className="text-muted-foreground">
          View items currently in your provider&apos;s Trash folder.
        </p>
      </div>

      <Card>
          <CardHeader>
            <CardTitle>Trash Bin</CardTitle>
            <CardDescription>
                Items in trash are automatically deleted after 30 days. Don&apos;t use this for long-term storage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emails?.length > 0 ? (
                <ScrollArea className="h-[500px]">
                    <div className="divide-y">
                    {emails.map((email: any) => (
                        <div key={email.id} className="flex items-center justify-between p-4">
                            <div className="grid gap-1">
                                <div className="font-medium flex items-center gap-2">
                                    {email.subject || '(No Subject)'}
                                    <Badge variant="outline" className="text-xs">
                                        {email.provider}
                                    </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {email.sender?.name || email.sender?.address}
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(email.date), { addSuffix: true })}
                            </div>
                        </div>
                    ))}
                    </div>
                </ScrollArea>
            ) : (
                <div className="py-12 text-center text-muted-foreground">
                    <Trash2 className="mx-auto h-8 w-8 mb-4 opacity-50" />
                    <p>Trash is empty</p>
                </div>
            )}
          </CardContent>
      </Card>
    </div>
  )
}
