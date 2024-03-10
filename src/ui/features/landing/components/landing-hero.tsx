import { Button } from "@/src/ui/components/shadcn/ui/button";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { FileUp, GraduationCap, Layers } from "lucide-react";
import Link from "next/link";

export function LandingHero() {
  return (
    <div className="py-24 md:py-36">
      <h1 className={cn(textStyles.h1, "text-center px-8")}>
        Olvídate de memorizar
      </h1>
      <div className="h-12" />
      <HeroSteps />
      <div className="h-12" />
      <HeroButtons />
    </div>
  );
}

function HeroSteps() {
  return (
    <div className="mx-auto px-8 flex flex-col space-y-4 w-fit">
      <HeroStep text="Sube tus apuntes" icon={<FileUp />} />
      <HeroStep text="Genera flashcards con A.I." icon={<Layers />} />
      <HeroStep
        text="Estudia de forma divertida y eficiente"
        icon={<GraduationCap />}
      />
    </div>
  );
}

interface HeroStepViewModel {
  text: string;
  icon: React.ReactNode;
}

function HeroStep({ text, icon }: HeroStepViewModel) {
  return (
    <div className="flex items-center">
      <div className="pr-4 text-slate-700">{icon}</div>
      <p className={textStyles.lead}>{text}</p>
    </div>
  );
}

function HeroButtons() {
  return (
    <div className="mx-auto px-8 flex space-x-8 w-fit">
      <Button variant="ghost" asChild>
        <Link href="/auth/login">Login</Link>
      </Button>
      <Button asChild>
        <Link href="/auth/register">Crear cuenta</Link>
      </Button>
    </div>
  );
}
