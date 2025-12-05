"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/providers/auth-provider"

export default function DashboardPage() {
  const { } = useAuth()

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 MB</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button>Sync Inbox</Button>
      </div>

      <div className="rounded-md border">
        <div className="p-4 text-center text-muted-foreground">
          No emails found. Connect an account to get started.
        </div>
      </div>
    </div>
  )
}
