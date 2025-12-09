export type Category = 'primary' | 'social' | 'updates' | 'promotions' | 'finance' | 'travel';

export function classifyEmail(email: {
  sender: { address: string };
  subject: string;
  snippet: string;
  headers: any;
}): Category {
  const subject = email.subject?.toLowerCase() || '';
  const sender = email.sender.address.toLowerCase();

  const snippet = email.snippet?.toLowerCase() || '';
  
  // 1. Finance (High Priority)
  // Check for banks, invoices, receipts
  const financeKeywords = ['invoice', 'receipt', 'payment', 'bill', 'statement', 'transaction', 'order confirmed', 'your order'];
  const financeSenders = ['stripe.com', 'paypal.com', 'wise.com', 'billing', 'finance', 'accounting', 'razorpay', 'bank', 'chase', 'amex'];
  
  if (financeKeywords.some(k => subject.includes(k)) || financeSenders.some(s => sender.includes(s))) {
    return 'finance';
  }

  // 2. Travel
  // Flights, hotels, tickets
  const travelKeywords = ['flight', 'booking', 'reservation', 'ticket', 'boarding pass', 'hotel', 'airbnb', 'uber', 'lyft'];
  if (travelKeywords.some(k => subject.includes(k))) {
    return 'travel';
  }

  // 3. Social
  // Social media notifications
  const socialDomains = ['facebook.com', 'twitter.com', 'x.com', 'linkedin.com', 'instagram.com', 'pinterest.com', 'tiktok.com', 'youtube.com'];
  if (socialDomains.some(d => sender.includes(d))) {
    return 'social';
  }

  // 4. Promotions / Updates
  // If it has List-Unsubscribe, it's likely automated.
  if (email.headers && (email.headers['list-unsubscribe'] || email.headers['list-unsubscribe-post'])) {
     // Distinguish between pure marketing (Promotions) and newsletters/updates (Updates)
     // This is hard to do perfectly, but "sale", "off", "discount" usually means promotion.
     const promoKeywords = ['sale', '% off', 'discount', 'offer', 'deal', 'limited time'];
     if (promoKeywords.some(k => subject.includes(k) || snippet.includes(k))) {
         return 'promotions';
     }
     return 'updates';
  }

  // 5. Default to Primary
  return 'primary';
}
