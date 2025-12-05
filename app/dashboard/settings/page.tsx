"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BadgeCheck, CreditCard, Bell, ChevronRight, Palette, Shield, HelpCircle } from "lucide-react"
import Link from "next/link"

const settingsItems = [
  {
    title: "Account",
    description: "Manage your profile, connected email accounts, and preferences.",
    icon: BadgeCheck,
    href: "/dashboard/account",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Billing",
    description: "Manage your subscription plan, payment methods, and billing history.",
    icon: CreditCard,
    href: "/dashboard/billing",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Notifications",
    description: "Configure how and when you want to be notified about your inbox.",
    icon: Bell,
    href: "/dashboard/notifications",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Appearance",
    description: "Customize the look and feel of your dashboard, including dark mode.",
    icon: Palette,
    href: "/dashboard/settings/appearance",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Security",
    description: "Manage your password, two-factor authentication, and active sessions.",
    icon: Shield,
    href: "/dashboard/settings/security",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    title: "Help & Support",
    description: "Get help with InboxOS, view documentation, or contact support.",
    icon: HelpCircle,
    href: "/dashboard/settings/help",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
]

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingsItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full transition-all hover:bg-muted/50 hover:border-primary/20 cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${item.bgColor} ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <CardTitle className="mt-4">{item.title}</CardTitle>
                <CardDescription>
                  {item.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
