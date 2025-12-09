"use client"

import * as React from "react"
import { ChevronsUpDown, Inbox } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { AddAccountDialog } from "./add-account-dialog"

import { Suspense } from "react"

function InboxSwitcherContent() {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentInboxId = searchParams.get('inboxId')

  const { data: accountsData } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const res = await fetch('/api/accounts')
      if (!res.ok) throw new Error('Failed to fetch accounts')
      return res.json()
    },
  })

  const accounts = accountsData?.accounts || []
  const plan = accountsData?.plan || 'FREE'
  const maxInboxes = plan === 'FREE' ? 1 : plan === 'PRO' ? 3 : Infinity

  const activeAccount = accounts.find((a: any) => a.id === currentInboxId)
  
  const handleSelect = (inboxId: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (inboxId) {
      params.set('inboxId', inboxId)
    } else {
      params.delete('inboxId')
    }
    router.push(`/dashboard?${params.toString()}`)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              suppressHydrationWarning
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {activeAccount ? (
                  <img 
                    src={`/logos/${activeAccount.provider === 'azure' ? 'outlook' : activeAccount.provider}.svg`} 
                    alt={activeAccount.provider}
                    className="size-4"
                  />
                ) : (
                  <Inbox className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeAccount ? activeAccount.email_address : "All Inboxes"}
                </span>
                <span className="truncate text-xs">
                  {activeAccount ? "Connected" : "InboxOS"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Inboxes
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handleSelect(null)}
              className="gap-2 p-2"
            >
              <div className="flex size-6 items-center justify-center rounded-sm border">
                <Inbox className="size-4" />
              </div>
              All Inboxes
              <DropdownMenuShortcut>⌘1</DropdownMenuShortcut>
            </DropdownMenuItem>
            {accounts.map((account: any, index: number) => (
              <DropdownMenuItem
                key={account.id}
                onClick={() => handleSelect(account.id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <img 
                    src={`/logos/${account.provider === 'azure' ? 'outlook' : account.provider}.svg`} 
                    alt={account.provider}
                    className="size-4"
                  />
                </div>
                {account.email_address}
                <DropdownMenuShortcut>⌘{index + 2}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <div className="p-2">
               <AddAccountDialog 
                 currentCount={accounts.length} 
                 maxInboxes={maxInboxes} 
                 plan={plan} 
               />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function InboxSwitcher() {
  return (
    <Suspense fallback={<div className="h-12 w-full animate-pulse rounded-lg bg-sidebar-accent/50" />}>
      <InboxSwitcherContent />
    </Suspense>
  )
}
