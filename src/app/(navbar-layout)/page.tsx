import { LandingAdvantagesSection } from "@/src/ui/features/landing/components/landing-advantages-section";
import { LandingFaq } from "@/src/ui/features/landing/components/landing-faq";
import { LandingHero } from "@/src/ui/features/landing/components/landing-hero";

export default function Home() {
  return (
    <main>
      <LandingHero />
      <LandingAdvantagesSection />
      <LandingFaq />
    </main>
  );
}
