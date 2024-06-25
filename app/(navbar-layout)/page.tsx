import { LandingAdvantagesSection } from "@/src/landing/ui/components/landing-advantages-section";
import { LandingFaq } from "@/src/landing/ui/components/landing-faq";
import { LandingHero } from "@/src/landing/ui/components/landing-hero";

/**
 * Displays the Landing page. This page contains basic information about the platform
 * and call to action to become a user.
 */
export default function LandingPage() {
  return (
    <main>
      <LandingHero />
      <LandingAdvantagesSection />
      <LandingFaq />
    </main>
  );
}
