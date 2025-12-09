import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { startOfDay, subDays, format } from 'date-fns'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 1. Get all emails for aggregation (last 30 days)
  const now = new Date()
  const thirtyDaysAgo = subDays(now, 30)

  const { data: emails, error } = await supabase
    .from('emails')
    .select('id, sender_address, received_at, category')
    .eq('user_id', user.id)
    .gte('received_at', thirtyDaysAgo.toISOString())

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 2. Aggregate Top Senders
  const senderCounts: Record<string, number> = {}
  emails?.forEach(email => {
    senderCounts[email.sender_address] = (senderCounts[email.sender_address] || 0) + 1
  })

  const topSenders = Object.entries(senderCounts)
    .map(([email, count]) => ({ email, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // 3. Aggregate Daily Volume (Last 7 Days)
  const dailyVolume: Record<string, number> = {}
  // Initialize last 7 days with 0
  for (let i = 6; i >= 0; i--) {
     const date = format(subDays(now, i), 'yyyy-MM-dd')
     dailyVolume[date] = 0
  }

  emails?.filter(e => new Date(e.received_at) >= subDays(now, 7)).forEach(email => {
    const date = format(new Date(email.received_at), 'yyyy-MM-dd')
    if (dailyVolume[date] !== undefined) {
      dailyVolume[date]++
    }
  })

  const volumeData = Object.entries(dailyVolume).map(([date, count]) => ({
    name: format(new Date(date), 'EEE'), // Mon, Tue
    fullDate: date,
    count
  }))

  // 4. Aggregate Category Distribution
  const categoryCounts: Record<string, number> = {}
  emails?.forEach(email => {
    const cat = email.category || 'uncategorized'
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
  })

  const categoryData = Object.entries(categoryCounts)
    .map(([name, value]) => ({ name, value }))
    // Sort logic handled in frontend or optional here
  
  return NextResponse.json({
    topSenders,
    volumeData,
    categoryData,
    totalEmails: emails.length
  })
}
