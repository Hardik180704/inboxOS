"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FAQS = [
  {
    question: "Which email providers does InboxOS support?",
    answer: "InboxOS supports Gmail, Google Workspace, Outlook / Office 365, and any IMAP-based email provider.",
  },
  {
    question: "Will InboxOS replace my existing email client?",
    answer: "No. InboxOS is not an email client. It works alongside Gmail, Outlook, Apple Mail, and other clients to automate cleaning and organization.",
  },
  {
    question: "How does auto-clean work?",
    answer: "Our AI scans your inbox for newsletters, promos, spam, and low-priority emails, then moves or deletes them automatically based on your plan and rules.",
  },
  {
    question: "Can InboxOS unsubscribe me from newsletters?",
    answer: "Yes. InboxOS detects List-Unsubscribe links and can automatically unsubscribe you from noisy senders on Pro and Premium plans.",
  },
  {
    question: "Is InboxOS safe and secure?",
    answer: "Absolutely. We use OAuth for Gmail/Outlook, never store full email bodies, and only access metadata needed for cleaning. Inbox passwords for IMAP are encrypted.",
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes. If you’re not satisfied, we offer refunds within 14 days of upgrading—no questions asked.",
  },
  {
    question: "Can I try InboxOS for free?",
    answer: "Yes. All users start on the Free plan and can upgrade anytime. Some plans also include free trial periods depending on promotions.",
  },
  {
    question: "Does InboxOS work with multiple inboxes?",
    answer: "Yes. Pro users can connect up to 3 inboxes, and Premium users can connect unlimited inboxes.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-gray-50/50 dark:bg-black border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl">
            Everything you need to know about InboxOS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {FAQS.map((faq, index) => (
            <Card 
              key={index} 
              className="border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-zinc-900/50"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold leading-tight">
                  {faq.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
