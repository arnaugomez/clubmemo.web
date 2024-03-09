import { Footer } from "@/lib/ui/components/footer/footer";
import { Navbar } from "@/lib/ui/components/navbar/navbar";
import { LandingAdvantagesSection } from "@/lib/ui/features/landing/components/landing-advantages-section";
import { LandingFaq } from "@/lib/ui/features/landing/components/landing-faq";
import { LandingHero } from "@/lib/ui/features/landing/components/landing-hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <LandingHero />
        <LandingAdvantagesSection />
        <LandingFaq />
      </main>
      <Footer />
    </>
  );
}
