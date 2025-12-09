"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, Trash2, Plus, Zap } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

export default function RulesPage() {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [newRule, setNewRule] = useState({
    name: '',
    type: 'sender',
    value: '',
    action: 'archive'
  })

  const { data: rules, isLoading } = useQuery({
    queryKey: ['rules'],
    queryFn: async () => {
      const res = await fetch('/api/rules')
      if (!res.ok) throw new Error('Failed to fetch rules')
      return res.json()
    }
  })

  const createMutation = useMutation({
    mutationFn: async (rule: any) => {
      const res = await fetch('/api/rules', {
        method: 'POST',
        body: JSON.stringify(rule)
      })
      if (!res.ok) throw new Error('Failed to create rule')
      return res.json()
    },
    onSuccess: () => {
      toast.success('Rule created')
      setIsOpen(false)
      setNewRule({ name: '', type: 'sender', value: '', action: 'archive' })
      queryClient.invalidateQueries({ queryKey: ['rules'] })
    },
    onError: () => toast.error('Failed to create rule')
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch('/api/rules', {
        method: 'DELETE',
        body: JSON.stringify({ id })
      })
      if (!res.ok) throw new Error('Failed to delete rule')
      return res.json()
    },
    onSuccess: () => {
      toast.success('Rule deleted')
      queryClient.invalidateQueries({ queryKey: ['rules'] })
    },
    onError: () => toast.error('Failed to delete rule')
  })

  const handleCreate = () => {
    if (!newRule.name || !newRule.value) {
      toast.error('Please fill all fields')
      return
    }
    createMutation.mutate(newRule)
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rules & Automation</h1>
          <p className="text-muted-foreground">
            Set up rules to automatically organize incoming emails.
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Rule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Rule</DialogTitle>
              <DialogDescription>
                When a new email matches this rule, the action will be applied automatically.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Rule Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Archive Newsletters" 
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">If...</Label>
                  <Select 
                    value={newRule.type} 
                    onValueChange={(val: string) => setNewRule({ ...newRule, type: val })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sender">Sender address contains</SelectItem>
                      <SelectItem value="subject">Subject contains</SelectItem>
                      <SelectItem value="domain">Sender domain is</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="value">Value</Label>
                  <Input 
                    id="value" 
                    placeholder="e.g. newsletter" 
                    value={newRule.value}
                    onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="action">Then...</Label>
                <Select 
                  value={newRule.action} 
                  onValueChange={(val: string) => setNewRule({ ...newRule, action: val })}
                >
                  <SelectTrigger id="action">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="archive">Archive (Skip Inbox)</SelectItem>
                    <SelectItem value="trash">Move to Trash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {rules?.map((rule: any) => (
          <Card key={rule.id}>
            <div className="flex items-center justify-between p-6">
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{rule.name}</h3>
                  <Badge variant="secondary" className="capitalize">
                    {rule.action}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                   <Zap className="h-3 w-3" />
                   If <strong>{rule.type}</strong> contains <strong>&quot;{rule.value}&quot;</strong>
                </div>
              </div>
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => deleteMutation.mutate(rule.id)}
                disabled={deleteMutation.isPending}
                className="text-muted-foreground hover:text-destructive"
              >
                {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </div>
          </Card>
        ))}

        {rules?.length === 0 && (
          <div className="text-center py-12 border rounded-lg border-dashed">
            <Zap className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No Rules Yet</h3>
            <p className="text-muted-foreground">                Create your first rule to automate your inbox. Try &quot;Archive newsletters&quot; or &quot;Label finance emails&quot;.</p>
          </div>
        )}
      </div>
    </div>
  )
}
