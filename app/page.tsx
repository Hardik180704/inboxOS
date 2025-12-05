import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { FeatureTicker } from "@/components/landing/feature-ticker";
import { FeatureOrganization } from "@/components/landing/feature-organization";
import { FeatureDrafts } from "@/components/landing/feature-drafts";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <section id="how-it-works">
          <FeatureTicker />
        </section>
        <section id="features">
          <FeatureOrganization />
          <FeatureDrafts />
        </section>
        <section id="pricing">
          <Pricing />
        </section>
        <section id="faq">
          <FAQ />
        </section>
      </main>
      <Footer />
    </div>
  );
}
