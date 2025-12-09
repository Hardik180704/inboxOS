import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { FeatureTicker } from "@/components/landing/feature-ticker";
import { FeatureOrganization } from "@/components/landing/feature-organization";
import { FeatureDrafts } from "@/components/landing/feature-drafts";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

import { ScrollAnimation } from "@/components/landing/scroll-animation";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <ScrollAnimation direction="none">
           <Hero />
        </ScrollAnimation>
        
        <section id="how-it-works">
          <ScrollAnimation delay={0.2}>
            <FeatureTicker />
          </ScrollAnimation>
        </section>

        <section id="features" className="space-y-12 py-12">
          <ScrollAnimation direction="left">
            <FeatureOrganization />
          </ScrollAnimation>
          <ScrollAnimation direction="right">
             <FeatureDrafts />
          </ScrollAnimation>
        </section>

        <section id="pricing">
          <ScrollAnimation>
            <Pricing />
          </ScrollAnimation>
        </section>

        <section id="faq">
           <ScrollAnimation delay={0.1}>
            <FAQ />
           </ScrollAnimation>
        </section>
      </main>
      <ScrollAnimation direction="none">
        <Footer />
      </ScrollAnimation>
    </div>
  );
}
