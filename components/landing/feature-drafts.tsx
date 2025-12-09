"use client";

export function FeatureDrafts() {
  return (
    <section className="py-20 lg:py-32 bg-gray-50 dark:bg-zinc-900/50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Pre-written drafts waiting in your inbox
          </h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            When you check your inbox, every email needing a response will have a pre-drafted reply in your tone, ready for you to send.
          </p>
        </div>
        
        <div className="relative w-full max-w-4xl mx-auto">
          <img 
            src="/drafts_feature.png" 
            alt="AI Drafts Integration" 
            className="w-full h-auto rounded-xl shadow-lg dark:brightness-[0.85] dark:border dark:border-white/10"
          />
        </div>
      </div>
    </section>
  );
}
