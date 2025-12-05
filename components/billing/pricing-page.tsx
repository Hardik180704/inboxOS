"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/components/providers/auth-provider"
import { useEffect, useState } from "react"
import { initializePaddle, Paddle } from '@paddle/paddle-js';



const PRICES = {
  PRO_MONTHLY: "pri_01hry02222222222222222222", // Replace with your actual price ID
  PREMIUM_MONTHLY: "pri_01hry02222222222222222222", // Replace with your actual price ID
}

export function PricingPage() {
  const { } = useAuth()
  const [loading, setLoading] = useState(false)
  const [paddle, setPaddle] = useState<Paddle>()

  useEffect(() => {
    initializePaddle({
      environment: 'sandbox',
      token: 'test_865c36353245453453453453453' // Replace with your actual client-side token
    }).then((paddleInstance: Paddle | undefined) => {
      if (paddleInstance) {
        setPaddle(paddleInstance);
      }
    });
  }, []);

  const handleCheckout = async (priceId: string) => {
    if (!paddle) return;
    setLoading(true)
    try {
      // Get config from backend (optional, but good for security/custom data)
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const data = await res.json()
      
      if (data.error) throw new Error(data.error);

      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customData: data.customData,
        customer: {
            email: data.userEmail
        },
        settings: {
            displayMode: 'overlay',
            successUrl: `${window.location.origin}/dashboard?success=true`,
        }
      });
    } catch (_error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {/* FREE PLAN */}
      <Card>
        <CardHeader>
          <CardTitle>Free</CardTitle>
          <CardDescription>For casual users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> 1 Inbox</li>
            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Manual Clean</li>
            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> 500 Emails Scan</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="outline" disabled>Current Plan</Button>
        </CardFooter>
      </Card>

      {/* PRO PLAN */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Pro</CardTitle>
          <CardDescription>For power users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">$9<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> 3 Inboxes</li>
            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Daily Auto-Clean</li>
            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Unlimited Scan</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => handleCheckout(PRICES.PRO_MONTHLY)}
            disabled={loading || !paddle}
          >
            {loading ? "Processing..." : "Upgrade to Pro"}
          </Button>
        </CardFooter>
      </Card>

      {/* PREMIUM PLAN */}
      <Card>
        <CardHeader>
          <CardTitle>Premium</CardTitle>
          <CardDescription>For teams & agencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">$29<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Unlimited Inboxes</li>
            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Real-time Auto-Clean</li>
            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Priority Support</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => handleCheckout(PRICES.PREMIUM_MONTHLY)}
            disabled={loading || !paddle}
          >
            Upgrade to Premium
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
