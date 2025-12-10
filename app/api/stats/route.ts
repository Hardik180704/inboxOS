import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('accountId')

    // Fetch total emails
    let totalEmailsQuery = supabase
      .from('emails')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
    
    if (accountId) {
      totalEmailsQuery = totalEmailsQuery.eq('account_id', accountId)
    }

    const { count: totalEmails } = await totalEmailsQuery

    // Fetch newsletters
    let newslettersQuery = supabase
      .from('emails')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('category', 'updates')

    if (accountId) {
      newslettersQuery = newslettersQuery.eq('account_id', accountId)
    }

    const { count: newsletters } = await newslettersQuery

    // Fetch recent emails
    let recentEmailsQuery = supabase
      .from('emails')
      .select('*')
      .eq('user_id', user.id)
      .order('received_at', { ascending: false })
      .limit(1000)

    if (accountId) {
      recentEmailsQuery = recentEmailsQuery.eq('account_id', accountId)
    }

    const { data: recentEmails } = await recentEmailsQuery

    // Mock storage saved (in a real app, calculate based on deleted emails size)
    // For now, let's just return 0 or a random number if we had deleted emails
    const storageSaved = 0; 

    return NextResponse.json({
      totalEmails: totalEmails || 0,
      newsletters: newsletters || 0,
      storageSaved,
      recentEmails: recentEmails || [],
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
