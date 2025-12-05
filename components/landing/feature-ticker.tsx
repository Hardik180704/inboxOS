"use client";

import Marquee from "@/components/landing/marquee";
import { Zap, Mail, Layers, Brain, RefreshCw, Shield, Sparkles } from "lucide-react";

const FEATURES = [
  { name: "Instant cleanup", icon: Zap },
  { name: "Auto-unsubscribe", icon: Mail },
  { name: "Multi-provider support", icon: Layers },
  { name: "Smart categories", icon: Brain },
  { name: "Adaptive AI", icon: Sparkles },
  { name: "Real-time sync", icon: RefreshCw },
  { name: "Zero clutter mode", icon: Shield },
];

export function FeatureTicker() {
  return (
    <section className="py-24 bg-background border-y border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Your inbox should work for you. Not against you.
          </h2>
        </div>
        
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:40s] [--gap:1.5rem]">
            {FEATURES.map((feature, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 px-6 py-3 rounded-full border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group cursor-default"
              >
                <feature.icon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors" />
                <span className="text-lg font-medium text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors whitespace-nowrap">
                  {feature.name}
                </span>
              </div>
            ))}
          </Marquee>
          {/* Gradient fades for premium look */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background to-transparent"></div>
        </div>
      </div>
    </section>
  );
}
