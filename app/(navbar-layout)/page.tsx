import { LandingAdvantagesSection } from "@/src/landing/ui/components/landing-advantages-section";
import { LandingFaq } from "@/src/landing/ui/components/landing-faq";
import { LandingHero } from "@/src/landing/ui/components/landing-hero";

export default function Landing() {
  return (
    <main>
      <LandingHero />
      <LandingAdvantagesSection />
      <LandingFaq />
    </main>
  );
}
