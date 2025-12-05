"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Marquee from "@/components/landing/marquee";

const REVIEWS = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
];

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4 border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      }
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center pt-20 pb-32 text-center lg:pt-32 overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] max-w-4xl mx-auto bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-2">
            Meet The OS That Cleans <br className="hidden sm:inline" />
            Your Inbox For You
          </h1>
          
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            InboxOS organizes your inbox, drafts replies in your voice, and helps you reach inbox zero fast. Never miss an important email again.
          </p>
          
          <div className="flex flex-col gap-3 min-[400px]:flex-row items-center">
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 rounded-full text-base bg-blue-600 hover:bg-blue-700 text-white">
                Get started
              </Button>
            </Link>
            <Link href="#contact">
              <Button size="lg" variant="outline" className="h-12 px-8 rounded-full text-base">
                Talk to sales
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-4">
            <span>Works with</span>
            <div className="flex gap-2">
              <img src="/gmail.svg" alt="Gmail" className="h-5 w-5" />
              <img src="/outlook.svg" alt="Outlook" className="h-5 w-5" />
            </div>
          </div>

          <div className="relative mt-12 w-full max-w-5xl mx-auto rounded-xl shadow-2xl border bg-white overflow-hidden">
            <img 
              src="/dashboard_mockup.png" 
              alt="InboxOS Dashboard" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
