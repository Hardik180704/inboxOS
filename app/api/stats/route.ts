import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch total emails
    const { count: totalEmails } = await supabase
      .from('emails')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Fetch newsletters
    const { count: newsletters } = await supabase
      .from('emails')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('category', 'newsletter');

    // Fetch recent emails
    const { data: recentEmails } = await supabase
      .from('emails')
      .select('*')
      .eq('user_id', user.id)
      .order('received_at', { ascending: false })
      .limit(50);

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
