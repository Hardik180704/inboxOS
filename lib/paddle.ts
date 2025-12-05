import { Paddle, Environment } from '@paddle/paddle-node-sdk';

export const paddle = process.env.PADDLE_API_KEY 
  ? new Paddle(process.env.PADDLE_API_KEY, {
      environment: process.env.NODE_ENV === 'production' ? Environment.production : Environment.sandbox,
    })
  : new Proxy({} as Paddle, {
      get: () => () => {
        console.warn('Paddle API key is missing. Billing features are disabled.');
        return Promise.reject(new Error('Paddle API key is missing'));
      },
    });

export const PLANS = {
  FREE: 'FREE',
  PRO: 'PRO',
  PREMIUM: 'PREMIUM',
};

// Replace with your actual Paddle Price IDs
export const PRICES = {
  PRO_MONTHLY: 'pri_pro_monthly_dummy',
  PRO_YEARLY: 'pri_pro_yearly_dummy',
  PREMIUM_MONTHLY: 'pri_premium_monthly_dummy',
};

export function getPlanFromPriceId(priceId: string): string {
  if (priceId === PRICES.PRO_MONTHLY || priceId === PRICES.PRO_YEARLY) return PLANS.PRO;
  if (priceId === PRICES.PREMIUM_MONTHLY) return PLANS.PREMIUM;
  return PLANS.FREE;
}
