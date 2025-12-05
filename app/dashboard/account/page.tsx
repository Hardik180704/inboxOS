"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AccountList } from "@/components/dashboard/account-list"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

import { Suspense } from "react"

function AccountPageContent() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const connected = searchParams.get('connected')
    if (connected === 'true') {
      toast.success("Inbox connected successfully")
      // Clear param
      router.replace('/dashboard/account')
    } else if (connected === 'error') {
      toast.error("Failed to connect inbox")
      router.replace('/dashboard/account')
    } else if (connected === 'limit_reached') {
      toast.error("Plan limit reached. Upgrade to add more inboxes.")
      router.replace('/dashboard/account')
    }
  }, [searchParams, router])

  const userInitials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || "U"

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator />
      
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Your personal information. Managed via your login provider.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.user_metadata?.full_name || "User"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input 
                id="name" 
                defaultValue={user?.user_metadata?.full_name || ""} 
                disabled 
                className="bg-muted"
              />
              <p className="text-[0.8rem] text-muted-foreground">
                This is your public display name from your provider.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                defaultValue={user?.email || ""} 
                disabled 
                className="bg-muted"
              />
              <p className="text-[0.8rem] text-muted-foreground">
                Your email address is managed by {user?.app_metadata?.provider || "your provider"}.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AccountList />

      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions for your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all of your data.
              </p>
            </div>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div>Loading account settings...</div>}>
      <AccountPageContent />
    </Suspense>
  )
}
