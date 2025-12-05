import Stripe from 'stripe';

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia' as any,
      typescript: true,
    })
  : new Proxy({} as Stripe, {
      get: () => () => {
        console.warn('Stripe API key is missing. Billing features are disabled.');
        return Promise.reject(new Error('Stripe API key is missing'));
      },
    });

export const PLANS = {
  FREE: 'FREE',
  PRO: 'PRO',
  PREMIUM: 'PREMIUM',
};

// Replace with your actual Stripe Price IDs
export const PRICES = {
  PRO_MONTHLY: 'price_pro_monthly_dummy',
  PRO_YEARLY: 'price_pro_yearly_dummy',
  PREMIUM_MONTHLY: 'price_premium_monthly_dummy',
};
