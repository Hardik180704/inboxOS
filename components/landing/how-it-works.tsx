"use client";

import { ArrowRight } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Connect Your Account",
    description: "Securely link your Gmail or Outlook accounts with a single click.",
  },
  {
    number: "02",
    title: "AI Analysis",
    description: "Our AI scans your inbox to identify newsletters, spam, and important threads.",
  },
  {
    number: "03",
    title: "Review & Clean",
    description: "Review the suggestions and clean your inbox with confidence.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
            How It Works
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Three steps to Inbox Zero
          </h2>
          <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Getting started with InboxOS is simple and takes less than a minute.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5 text-2xl font-bold text-primary">
                {step.number}
              </div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {step.description}
              </p>
              {index < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-[2px] bg-gradient-to-r from-primary/20 to-transparent -z-10 transform translate-x-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
