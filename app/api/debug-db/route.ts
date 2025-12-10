
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(_request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', debug: 'No user found' }, { status: 401 });
    }

    const { count, error } = await supabase
      .from('emails')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    const { data: sample } = await supabase
      .from('emails')
      .select('id, subject, received_at')
      .eq('user_id', user.id)
      .limit(5);

    return NextResponse.json({
      userId: user.id,
      emailCount: count,
      error: error?.message,
      sample
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
