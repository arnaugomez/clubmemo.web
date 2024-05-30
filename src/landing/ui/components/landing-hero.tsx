import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import { FileUp, GraduationCap, Layers } from "lucide-react";
import Link from "next/link";

export function LandingHero() {
  return (
    <div className="py-24 md:py-36">
      <h1 className={cn(textStyles.h1, "px-8 text-center")}>
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
  const steps: HeroStepViewModel[] = [
    {
      text: "Sube tus apuntes",
      icon: <FileUp />,
    },
    {
      text: "Genera flashcards con A.I.",
      icon: <Layers />,
    },
    {
      text: "Estudia de forma divertida y eficiente",
      icon: <GraduationCap />,
    },
  ];
  return (
    <div className="mx-auto flex w-fit flex-col space-y-4 px-8">
      {steps.map((step, index) => (
        <HeroStep key={index} {...step} />
      ))}
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
    <div className="mx-auto flex w-fit space-x-8 px-8">
      <Button variant="ghost" asChild>
        <Link href="/auth/login">Login</Link>
      </Button>
      <Button asChild>
        <Link href="/auth/signup">Crear cuenta</Link>
      </Button>
    </div>
  );
}
