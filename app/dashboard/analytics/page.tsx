"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { Loader2, BarChart3 } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

import { createClient } from "@/lib/supabase/client"
import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"

// Custom tooltips to fix visibility issues
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-2 shadow-sm">
        <p className="text-sm font-medium capitalize">{payload[0].name}</p>
        <p className="text-sm text-muted-foreground">{payload[0].value} emails</p>
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  const { data: stats, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await fetch('/api/analytics')
      if (!res.ok) throw new Error('Failed to fetch analytics')
      return res.json()
    }
  })

  useEffect(() => {
    const channel = supabase
      .channel('analytics-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emails',
        },
        (payload) => {
          console.log('Realtime update:', payload)
          queryClient.invalidateQueries({ queryKey: ['analytics'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, queryClient])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
        <p className="text-muted-foreground">
          Visualizing your inbox activity over time.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails (30d)</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEmails}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Email Volume (Last 7 Days)</CardTitle>
            <CardDescription>
              Daily incoming email count.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.volumeData}>
                   <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}`} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#8884d8" fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Senders</CardTitle>
            <CardDescription>
              Who is emailing you the most?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.topSenders.map((sender: any, index: number) => (
                <div key={index} className="flex items-center">
                  <div className="ml-4 space-y-1 w-full">
                    <div className="flex justify-between items-center text-sm font-medium leading-none">
                      <span className="truncate max-w-[200px]" title={sender.email}>{sender.email}</span>
                      <span className="text-muted-foreground">{sender.count}</span>
                    </div>
                    {/* Simple progress bar representation */}
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-primary" 
                         style={{ width: `${Math.min((sender.count / stats.topSenders[0].count) * 100, 100)}%` }} 
                       />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>How your inbox is categorized.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats?.categoryData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                 {stats?.categoryData.map((entry: any, index: number) => (
                   <div key={index} className="flex items-center gap-1 text-xs">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                     <span className="capitalize">{entry.name} ({entry.value})</span>
                   </div>
                 ))}
              </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
