import { Footer } from "@/src/ui/components/footer/footer";
import { Navbar } from "@/src/ui/components/navbar/navbar";
import { LandingAdvantagesSection } from "@/src/ui/features/landing/components/landing-advantages-section";
import { LandingFaq } from "@/src/ui/features/landing/components/landing-faq";
import { LandingHero } from "@/src/ui/features/landing/components/landing-hero";

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
