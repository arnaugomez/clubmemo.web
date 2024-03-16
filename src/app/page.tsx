import { Footer } from "@/src/ui/components/footer/footer";
import { LandingAdvantagesSection } from "@/src/ui/features/landing/components/landing-advantages-section";
import { LandingFaq } from "@/src/ui/features/landing/components/landing-faq";
import { LandingHero } from "@/src/ui/features/landing/components/landing-hero";
import { Navbar } from "@/src/ui/features/navbar/components/navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Link href={"/random-number"}>Randomm number</Link>
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
