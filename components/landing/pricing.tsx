"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, X, Minus, Zap, Shield, Sparkles, Inbox, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const isYearly = billingPeriod === "yearly";

  return (
    <section id="pricing" className="py-24 bg-white dark:bg-black text-foreground overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* SECTION 1: HEADER + TOGGLE */}
        <div className="flex flex-col items-center text-center mb-16 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Choose the plan that fits your inbox. No hidden fees.
          </p>
          
          <div className="flex items-center justify-center mt-6">
            <div className="relative flex items-center bg-muted rounded-full p-1 border">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={cn(
                  "relative z-10 px-6 py-2 text-sm font-medium rounded-full transition-all duration-300",
                  !isYearly ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Monthly billing
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={cn(
                  "relative z-10 px-6 py-2 text-sm font-medium rounded-full transition-all duration-300",
                  isYearly ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Yearly billing <span className="text-xs text-green-600 font-bold ml-1">(save 20%)</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: PRICING CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {/* FREE PLAN */}
          <Card className="flex flex-col border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Free</CardTitle>
              <CardDescription>For casual users</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> 1 Inbox
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> Manual Clean
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> 500 Emails Scan
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/login?plan=free" className="w-full">
                <Button variant="outline" className="w-full rounded-full" size="lg">
                  Get Started
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* PRO PLAN */}
          <Card className="flex flex-col relative border-primary shadow-lg scale-105 z-10 bg-background">
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <Badge className="bg-primary hover:bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs uppercase tracking-wide">
                Most Popular
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Pro</CardTitle>
              <CardDescription>For power users</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold transition-all duration-300">
                  {isYearly ? "$59" : "$6.99"}
                </span>
                <span className="text-muted-foreground">
                  {isYearly ? "/year" : "/mo"}
                </span>
              </div>
              <ul className="space-y-3 text-sm font-medium">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> 3 Inboxes
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> Daily Auto-Clean
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> Unlimited Scan
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> Auto-Unsubscribe
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> Smart AI Categorization
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> Priority Clean Queue
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/login?plan=pro" className="w-full">
                <Button className="w-full rounded-full" size="lg">
                  Upgrade to Pro
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* PREMIUM PLAN */}
          <Card className="flex flex-col border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Premium</CardTitle>
              <CardDescription>For teams & agencies</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold transition-all duration-300">
                  {isYearly ? "$119" : "$12.99"}
                </span>
                <span className="text-muted-foreground">
                  {isYearly ? "/year" : "/mo"}
                </span>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> Unlimited Inboxes
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> Real-time Auto-Clean
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> Priority Support
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> Advanced AI Insights
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> Team Access (3 users)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> Custom Rules
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/login?plan=premium" className="w-full">
                <Button variant="outline" className="w-full rounded-full" size="lg">
                  Get Premium
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* SECTION 3: ADD-ON STRIP */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="bg-muted/30 border rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-2 text-center md:text-left">
              <h3 className="text-lg font-bold flex items-center justify-center md:justify-start gap-2">
                <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                Power Pack add-on — $2.99/mo
              </h3>
              <p className="text-muted-foreground text-sm">
                Unlock advanced automation tools for heavy-duty inbox management.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="px-3 py-1">Bulk cleanup</Badge>
              <Badge variant="secondary" className="px-3 py-1">Bulk unsubscribes</Badge>
              <Badge variant="secondary" className="px-3 py-1">Advanced filters</Badge>
              <Badge variant="secondary" className="px-3 py-1">Analytics</Badge>
            </div>
            <Button variant="ghost" size="sm" className="hidden md:inline-flex">
              Add to plan <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* SECTION 4: COMPARISON TABLE */}
        <div className="max-w-5xl mx-auto mb-32">
          <h3 className="text-2xl font-bold text-center mb-12">Compare features</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-4 px-4 font-medium text-muted-foreground w-1/3">Features</th>
                  <th className="py-4 px-4 font-bold text-center w-1/5">Free</th>
                  <th className="py-4 px-4 font-bold text-center text-primary w-1/5">Pro</th>
                  <th className="py-4 px-4 font-bold text-center w-1/5">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-4 px-4 text-sm font-medium">Max Inboxes</td>
                  <td className="py-4 px-4 text-center text-sm">1</td>
                  <td className="py-4 px-4 text-center text-sm font-bold">3</td>
                  <td className="py-4 px-4 text-center text-sm">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-sm font-medium">Email Scans</td>
                  <td className="py-4 px-4 text-center text-sm">500/mo</td>
                  <td className="py-4 px-4 text-center text-sm font-bold">Unlimited</td>
                  <td className="py-4 px-4 text-center text-sm">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-sm font-medium">Auto-Clean</td>
                  <td className="py-4 px-4 text-center"><Minus className="h-4 w-4 mx-auto text-muted-foreground" /></td>
                  <td className="py-4 px-4 text-center text-sm font-bold">Daily</td>
                  <td className="py-4 px-4 text-center text-sm">Real-time</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-sm font-medium">Auto-Unsubscribe</td>
                  <td className="py-4 px-4 text-center"><Minus className="h-4 w-4 mx-auto text-muted-foreground" /></td>
                  <td className="py-4 px-4 text-center"><Check className="h-4 w-4 mx-auto text-primary" /></td>
                  <td className="py-4 px-4 text-center"><Check className="h-4 w-4 mx-auto text-primary" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-sm font-medium">AI Classification</td>
                  <td className="py-4 px-4 text-center text-sm">Basic</td>
                  <td className="py-4 px-4 text-center text-sm font-bold">Smart</td>
                  <td className="py-4 px-4 text-center text-sm">Advanced</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-sm font-medium">Team Access</td>
                  <td className="py-4 px-4 text-center"><Minus className="h-4 w-4 mx-auto text-muted-foreground" /></td>
                  <td className="py-4 px-4 text-center"><Minus className="h-4 w-4 mx-auto text-muted-foreground" /></td>
                  <td className="py-4 px-4 text-center text-sm">3 Users</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 5: WHY INBOXOS */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Why choose InboxOS over generic cleaners?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We don't just delete emails. We build an intelligent operating system for your communications.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Inbox className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-bold">Built for multi-inbox chaos</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Connect Gmail, Outlook, and IMAP accounts in one unified dashboard. Stop switching tabs and start managing everything from one command center.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-bold">Truly automatic, not just filters</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our AI learns your preferences to auto-clean junk and unsubscribe from newsletters you never read, without you lifting a finger.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-bold">Privacy-first & transparent</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We process metadata, not content. Your personal data stays yours. No ads, no selling data, just a clean inbox.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}


