"use client";

import Marquee from "@/components/landing/marquee";

const LOGOS = [
  { name: "Zendesk", url: "/logos/zendesk.svg" },
  { name: "Wix", url: "/logos/wix.svg" },
  { name: "ByteDance", url: "/logos/bytedance.svg" },
  { name: "Notion", url: "/logos/notion.svg" },
  { name: "Linear", url: "/logos/linear.svg" },
  { name: "Airbnb", url: "/logos/airbnb.svg" },
  { name: "Google", url: "/logos/google.svg" },
  { name: "Microsoft", url: "/logos/microsoft.svg" },
];

export function TrustedBy() {
  return (
    <section className="py-20 border-b bg-gray-50/50">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <p className="text-sm font-medium text-muted-foreground mb-10">
          Join 15,000+ users saving hours daily
        </p>
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background py-10">
          <Marquee pauseOnHover className="[--duration:30s]">
            {LOGOS.map((logo) => (
              <div key={logo.name} className="mx-8 flex items-center justify-center">
                <img 
                  src={logo.url} 
                  alt={logo.name} 
                  className="h-8 w-auto opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300" 
                />
              </div>
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-gray-50/50 dark:from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-gray-50/50 dark:from-background"></div>
        </div>
      </div>
    </section>
  );
}
