"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import { Check, CreditCard, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function BillingPage() {
  const { user } = useAuth()
  const [plan, setPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchBilling() {
      if (!user) return
      const { data } = await supabase.from('users').select('plan').eq('id', user.id).single()
      setPlan(data?.plan || 'FREE')
      setLoading(false)
    }
    fetchBilling()
  }, [user, supabase])

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and billing information.
        </p>
      </div>
      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              You are currently on the <span className="font-medium text-foreground">{plan}</span> plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{plan === 'FREE' ? 'Free Plan' : 'Pro Plan'}</p>
                  <p className="text-sm text-muted-foreground">
                    {plan === 'FREE' ? 'Basic features' : '$19/month'}
                  </p>
                </div>
              </div>
              <Badge variant={plan === 'FREE' ? 'secondary' : 'default'}>
                {plan === 'active' ? 'Active' : 'Current'}
              </Badge>
            </div>
          </CardContent>
          <CardFooter>
            {plan === 'FREE' ? (
              <Link href="/pricing" className="w-full">
                <Button className="w-full">Upgrade to Pro</Button>
              </Link>
            ) : (
              <Button variant="outline" className="w-full">Manage Subscription</Button>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>
              Your recent invoices and transactions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground text-center py-8">
              No billing history available.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
