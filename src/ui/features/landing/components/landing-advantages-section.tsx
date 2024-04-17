import { Button } from "@/src/ui/components/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/ui/components/shadcn/ui/card";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { CalendarCheck, Dumbbell, Shapes } from "lucide-react";
import Link from "next/link";

export function LandingAdvantagesSection() {
  return (
    <div className="border-y-[1px] border-slate-200 bg-slate-100 py-16">
      <h2 className={cn(textStyles.h2, "px-8 text-center")}>
        ¿Por qué clubmemo es tan eficiente?
      </h2>
      <div className="h-4" />
      <p
        className={cn(
          textStyles.base,
          "mx-auto mt-0 max-w-prose px-8 text-center",
        )}
      >
        Clubmemo es más eficiente que leer tus apuntes. Su método se apoya en 3
        técnicas de estudio avaladas por la ciencia.
      </p>
      <div className="h-10" />

      <LandingAdvantageCards />
      <div className="h-16" />
      <p
        className={cn(textStyles.muted, "mx-auto max-w-prose px-8 text-center")}
      >
        Crea tu usuario en menos de 1 minuto
      </p>
      <div className="h-6" />
      <div className="mx-auto flex w-fit space-x-8 px-8">
        <Button asChild>
          <Link href="/auth/signup">Crear cuenta</Link>
        </Button>
      </div>
    </div>
  );
}

interface LandingAdvantageCardViewModel {
  title: string;
  icon: React.ReactNode;
  description: string;
}

function LandingAdvantageCards() {
  const advantages: LandingAdvantageCardViewModel[] = [
    {
      title: "Recuerdo activo",
      icon: <Dumbbell />,
      description:
        "Practicando lo aprendido con actividades dinámicas, reforzamos más la memoria que cuando nos limitamos a releer los apuntes.",
    },
    {
      title: "Repetición espaciada",
      icon: <CalendarCheck />,
      description:
        "Practicar un poco cada día es mejor que dedicar un día entero a estudiar. Clubmemo te ayuda a mantener un hábito de estudio.",
    },
    {
      title: "Práctica intercalada",
      icon: <Shapes />,
      description:
        "Alternar entre distintos temas en una misma sesión de estudio mejora la retención y el aprendizaje.",
    },
  ];
  return (
    <div className="mx-auto flex w-fit flex-col space-y-8 px-8 md:flex-row md:space-x-8 md:space-y-0">
      {advantages.map((advantage, index) => (
        <LandingAdvantageCard key={index} {...advantage} />
      ))}
    </div>
  );
}

function LandingAdvantageCard({
  title,
  icon,
  description,
}: LandingAdvantageCardViewModel) {
  return (
    <Card className="max-w-80 flex-1">
      <div className="px-6 pt-10">
        <div className="mx-auto w-fit">{icon}</div>
      </div>
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
}
