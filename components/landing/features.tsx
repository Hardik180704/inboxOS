"use client";

import { Mail, Shield, BarChart3, Zap } from "lucide-react";

const FEATURES = [
  {
    title: "AI-Powered Cleaning",
    description: "Our advanced AI algorithms automatically categorize and clean your inbox, keeping it clutter-free.",
    icon: Zap,
  },
  {
    title: "Privacy First",
    description: "Your data is encrypted and secure. We never sell your personal information to third parties.",
    icon: Shield,
  },
  {
    title: "Deep Analytics",
    description: "Gain insights into your email habits with detailed analytics and reports.",
    icon: BarChart3,
  },
  {
    title: "Multi-Provider Support",
    description: "Connect multiple Gmail and Outlook accounts and manage them all from a single dashboard.",
    icon: Mail,
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-gray-50 dark:bg-zinc-900/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
            Features
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Everything you need to master your inbox
          </h2>
          <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            InboxOS provides a comprehensive suite of tools to help you regain control over your email.
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-4 rounded-lg border p-8 shadow-sm transition-all hover:shadow-md bg-white dark:bg-black dark:border-gray-800"
            >
              <div className="rounded-full bg-primary/10 p-3">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
