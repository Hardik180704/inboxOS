import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe, PLANS } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Use a service role client for webhooks to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.warn('Stripe webhook secret is missing. Skipping webhook handling.');
      return NextResponse.json({ received: true, status: 'skipped_no_secret' });
    }

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const subscription = event.data.object as Stripe.Subscription;

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        if (!session?.metadata?.userId) break;
        
        const subscriptionId = session.subscription as string;
        await supabaseAdmin
          .from('users')
          .update({
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscriptionId,
            plan: PLANS.PRO, // Default to PRO for now, logic can be enhanced
          })
          .eq('id', session.metadata.userId);

        await logBillingEvent(session.metadata.userId, 'SUBSCRIBED', 'FREE', 'PRO', event.id);
        break;
      }

      case 'customer.subscription.updated': {
        const customerId = subscription.customer as string;
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('id, plan')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!user) break;

        const status = subscription.status;
        let newPlan = user.plan;

        if (status === 'active' || status === 'trialing') {
          newPlan = PLANS.PRO; // Or check price ID to determine PRO vs PREMIUM
        } else if (status === 'past_due') {
          // Grace period logic
        } else if (status === 'canceled' || status === 'unpaid') {
          newPlan = PLANS.FREE;
        }

        if (newPlan !== user.plan) {
          await supabaseAdmin
            .from('users')
            .update({ plan: newPlan })
            .eq('id', user.id);
          
          await logBillingEvent(user.id, newPlan === 'FREE' ? 'CANCELLED' : 'RENEWED', user.plan, newPlan, event.id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const customerId = subscription.customer as string;
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('id, plan')
          .eq('stripe_customer_id', customerId)
          .single();

        if (user) {
          await supabaseAdmin
            .from('users')
            .update({ plan: PLANS.FREE })
            .eq('id', user.id);
            
          await logBillingEvent(user.id, 'CANCELLED', user.plan, 'FREE', event.id);
        }
        break;
      }
    }
  } catch (error) {
    console.error('Webhook handler failed:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function logBillingEvent(userId: string, type: string, oldPlan: string, newPlan: string, stripeEventId: string) {
  await supabaseAdmin.from('billing_events').insert({
    user_id: userId,
    event_type: type,
    old_plan: oldPlan,
    new_plan: newPlan,
    stripe_event_id: stripeEventId,
  });
}
