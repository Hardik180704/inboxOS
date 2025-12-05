import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { priceId } = await request.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For Paddle Overlay, we just need to pass the user ID so the webhook knows who it is.
    // We return the config needed for the frontend to open the checkout.
    return NextResponse.json({
      customData: {
        userId: user.id,
      },
      userEmail: user.email,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
