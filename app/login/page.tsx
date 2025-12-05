"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleLogin = async (provider: 'google' | 'azure') => {
    setIsLoading(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${location.origin}/api/auth/callback`,
          scopes: provider === 'google' 
            ? 'openid profile email https://www.googleapis.com/auth/gmail.readonly' 
            : 'openid profile email Mail.Read offline_access',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) {
        console.error(error);
        setIsLoading(null);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full bg-white dark:bg-black bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-50/50 via-white/0 to-transparent dark:from-indigo-950/20 dark:via-black/0 pointer-events-none" />

      <Link
        href="/"
        className="absolute left-4 top-4 md:left-8 md:top-8 z-50 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="w-full max-w-[400px] px-4 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="InboxOS" className="h-10 w-10 object-contain" />
            <span className="text-2xl font-bold tracking-tighter text-foreground">inboxOS</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <div className="w-full grid gap-4">
            <Button 
              variant="outline" 
              type="button" 
              disabled={!!isLoading} 
              onClick={() => handleLogin('google')}
              className="h-12 px-4 py-2 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-200 relative overflow-hidden group shadow-sm"
            >
              {isLoading === 'google' ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <img src="/logos/google.svg" alt="Google" className="mr-3 h-5 w-5" />
              )}
              <span className="flex-1 text-left font-medium">Sign in with Google</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400">→</span>
            </Button>
            
            <Button 
              variant="outline" 
              type="button" 
              disabled={!!isLoading} 
              onClick={() => handleLogin('azure')}
              className="h-12 px-4 py-2 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-200 relative overflow-hidden group shadow-sm"
            >
              {isLoading === 'azure' ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <img src="/logos/outlook.svg" alt="Outlook" className="mr-3 h-5 w-5" />
              )}
              <span className="flex-1 text-left font-medium">Sign in with Outlook</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400">→</span>
            </Button>
          </div>

          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-50 dark:bg-black px-2 text-muted-foreground font-medium tracking-wider">
                Secure access via OAuth
              </span>
            </div>
          </div>
          
          <div className="w-full grid grid-cols-2 gap-4 text-center text-xs text-muted-foreground">
             <div className="flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 py-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                <span>SOC2 Compliant</span>
             </div>
             <div className="flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 py-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                <span>Encrypted</span>
             </div>
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary font-medium">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary font-medium">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
