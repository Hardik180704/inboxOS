import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { paddle, getPlanFromPriceId, PLANS } from '@/lib/paddle';
import { createClient } from '@supabase/supabase-js';

// Use a service role client for webhooks to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const signature = (await headers()).get('Paddle-Signature') || '';
  const body = await request.text();

  if (!process.env.PADDLE_WEBHOOK_SECRET) {
    console.warn('Paddle webhook secret is missing. Skipping webhook handling.');
    return NextResponse.json({ received: true, status: 'skipped_no_secret' });
  }

  try {
    if (process.env.NODE_ENV !== 'development') { // Skip verification in local dev if needed, or use a tool to forward
       const eventData = paddle.webhooks.unmarshal(body, process.env.PADDLE_WEBHOOK_SECRET!, signature);
       // If unmarshal succeeds, it's valid.
    }
    
    // Parse body manually since unmarshal returns a typed object but we might want raw access or the SDK might behave differently in sandbox
    const eventData = JSON.parse(body);

    switch (eventData.event_type) {
      case 'subscription.created':
      case 'subscription.updated':
        const subscription = eventData.data;
        const userId = subscription.custom_data?.userId;
        
        if (!userId) break;

        const priceId = subscription.items[0].price.id;
        const newPlan = getPlanFromPriceId(priceId);
        const status = subscription.status;

        let finalPlan = newPlan;
        if (status !== 'active' && status !== 'trialing') {
            finalPlan = PLANS.FREE;
        }

        // Update User
        await supabaseAdmin
          .from('users')
          .update({
            paddle_customer_id: subscription.customer_id,
            paddle_subscription_id: subscription.id,
            plan: finalPlan,
            subscription_status: status,
          })
          .eq('id', userId);

        // Log Event
        await logBillingEvent(userId, eventData.event_type === 'subscription.created' ? 'SUBSCRIBED' : 'RENEWED', 'UNKNOWN', finalPlan, eventData.event_id);
        break;

      case 'subscription.canceled':
        const sub = eventData.data;
        // Find user by subscription ID if custom_data is missing (it should be there though)
        const { data: user } = await supabaseAdmin
            .from('users')
            .select('id, plan')
            .eq('paddle_subscription_id', sub.id)
            .single();
        
        if (user) {
             await supabaseAdmin
            .from('users')
            .update({
                plan: PLANS.FREE,
                subscription_status: 'canceled'
            })
            .eq('id', user.id);
            
            await logBillingEvent(user.id, 'CANCELLED', user.plan, 'FREE', eventData.event_id);
        }
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function logBillingEvent(userId: string, type: string, oldPlan: string, newPlan: string, providerEventId: string) {
  await supabaseAdmin.from('billing_events').insert({
    user_id: userId,
    event_type: type,
    old_plan: oldPlan,
    new_plan: newPlan,
    provider_event_id: providerEventId,
    provider: 'paddle'
  });
}
