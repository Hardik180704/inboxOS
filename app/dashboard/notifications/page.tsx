"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function NotificationsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  
  const [preferences, setPreferences] = useState({
    marketing: false,
    security: true,
    updates: true
  })

  useEffect(() => {
    async function fetchPreferences() {
      if (!user) return
      // In a real app, we'd fetch this from a 'preferences' column or table
      // For now, we'll just simulate it or read if column exists
      const { data } = await supabase.from('users').select('preferences').eq('id', user.id).single()
      if (data?.preferences) {
        setPreferences(data.preferences)
      }
      setLoading(false)
    }
    fetchPreferences()
  }, [user, supabase])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    
    const { error } = await supabase
      .from('users')
      .update({ preferences })
      .eq('id', user.id)

    if (error) {
      toast.error("Failed to save preferences")
    } else {
      toast.success("Preferences saved")
    }
    setSaving(false)
  }

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you receive notifications.
        </p>
      </div>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Choose what emails you want to receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <h4 className="font-medium">Marketing Emails</h4>
              <p className="text-sm text-muted-foreground">
                Receive emails about new products, features, and more.
              </p>
            </div>
            <Switch 
              checked={preferences.marketing}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, marketing: checked }))}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <h4 className="font-medium">Security Alerts</h4>
              <p className="text-sm text-muted-foreground">
                Receive emails about your account security.
              </p>
            </div>
            <Switch 
              checked={preferences.security}
              disabled
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <h4 className="font-medium">Product Updates</h4>
              <p className="text-sm text-muted-foreground">
                Receive emails about major product updates and changes.
              </p>
            </div>
            <Switch 
              checked={preferences.updates}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, updates: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Preferences
        </Button>
      </div>
    </div>
  )
}
