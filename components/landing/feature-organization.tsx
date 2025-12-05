"use client";

export function FeatureOrganization() {
  return (
    <section className="py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Automatically organized. <br />
            Never miss an important email again.
          </h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Drowning in emails? Don't waste energy trying to prioritize your emails. Our AI assistant will label everything automatically.
          </p>
        </div>
        
        <div className="relative w-full max-w-6xl mx-auto">
          <img 
            src="/organization_before_after.png" 
            alt="Inbox Organization Before and After" 
            className="w-full h-auto rounded-xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
