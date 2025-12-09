"use client"

import * as React from "react"
import { Glasses } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface FocusToggleProps {
  isFocusMode: boolean
  onToggle: (enabled: boolean) => void
}

export function FocusToggle({ isFocusMode, onToggle }: FocusToggleProps) {
  const handleToggle = (checked: boolean) => {
    onToggle(checked)
    if (checked) {
      toast.success("Focus Mode On", {
        description: "Newsletters and automated emails are hidden.",
        icon: <Glasses className="h-4 w-4" />,
      })
    } else {
      toast.info("Focus Mode Off", {
        description: "Showing all emails.",
      })
    }
  }

  return (
    <div className="flex items-center space-x-2 border rounded-full px-3 py-1.5 bg-background shadow-sm">
      <Switch 
        id="focus-mode" 
        checked={isFocusMode}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-indigo-600"
      />
      <Label htmlFor="focus-mode" className="text-xs font-medium cursor-pointer flex items-center gap-1.5">
        <Glasses className={`h-3.5 w-3.5 ${isFocusMode ? 'text-indigo-600' : 'text-muted-foreground'}`} />
        <span className={isFocusMode ? 'text-indigo-600' : 'text-muted-foreground'}>Focus</span>
      </Label>
    </div>
  )
}
