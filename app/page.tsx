import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lib/ui/components/ui/accordion";
import { Button } from "@/lib/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/lib/ui/components/ui/card";
import { cn } from "@/lib/ui/utils/shadcn";
import {
  CalendarCheck,
  Dumbbell,
  FileUp,
  GraduationCap,
  Layers,
  Shapes,
} from "lucide-react";

const textStyles = {
  logo: "text-2xl font-bold",
  h1: "text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "text-3xl font-semibold tracking-tight",
  h3: "text-2xl font-semibold tracking-tight",
  h4: "text-xl font-semibold tracking-tight",
  p: "text-base font-normal leading-7",
  base: "text-base font-normal",
  lead: "text-xl text-muted-foreground",
  muted: "text-sm text-muted-foreground",
};

export default function Home() {
  return (
    <>
      <header className="sticky top-0">
        <nav className="h-16 flex justify-between items-center px-6 border-slate-200 border-b-[1px] bg-white">
          <div className={cn(textStyles.logo, "text-slate-700")}>clubmemo</div>
          <Button variant="outline">Login</Button>
        </nav>
      </header>
      <main>
        <div className="py-36">
          <h1 className={cn(textStyles.h1, "text-center px-8")}>
            Olvídate de memorizar
          </h1>
          <div className="h-12" />

          <div className="mx-auto px-8 flex flex-col space-y-4 w-fit">
            <div className="flex items-center">
              <div className="pr-4 text-slate-700">
                <FileUp />
              </div>
              <p className={cn(textStyles.lead, "text-slate-500")}>
                Sube tus apuntes
              </p>
            </div>
            <div className="flex items-center">
              <div className="pr-4 text-slate-700">
                <Layers />
              </div>
              <p className={cn(textStyles.lead, "text-slate-500")}>
                Genera flashcards con A.I.
              </p>
            </div>
            <div className="flex items-center">
              <div className="pr-4 text-slate-700">
                <GraduationCap />
              </div>
              <p className={cn(textStyles.lead, "text-slate-500")}>
                Estudia de forma divertida y eficiente
              </p>
            </div>
          </div>
          <div className="h-12" />

          <div className="mx-auto px-8 flex space-x-8 w-fit">
            <Button variant="ghost">Login</Button>
            <Button variant="default">Crear cuenta</Button>
          </div>
        </div>

        <div className="border-y-[1px] border-slate-200 bg-slate-100 py-16">
          <h2 className={cn(textStyles.h2, "text-center px-8")}>
            ¿Por qué clubmemo es tan eficiente?
          </h2>
          <div className="h-4" />
          <p
            className={cn(
              textStyles.base,
              "mx-auto px-8 text-center max-w-prose mt-0",
            )}
          >
            Clubmemo es más eficiente que leer tus apuntes. Su método se apoya
            en 3 técnicas de estudio avaladas por la ciencia.
          </p>
          <div className="h-10" />

          <div className="flex w-fit mx-auto space-x-8 ">
            <Card className="max-w-80">
              <div className="pt-10 px-6">
                <div className="mx-auto w-fit">
                  <Dumbbell />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-center">Recuerdo activo</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Practicando lo aprendido con actividades dinámicas, reforzamos
                  más la memoria que cuando nos limitamos a releer los apuntes.
                </p>
              </CardContent>
            </Card>
            <Card className="max-w-80">
              <div className="pt-10 px-6">
                <div className="mx-auto w-fit">
                  <CalendarCheck />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-center">
                  Repetición espaciada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Practicar un poco cada día es exponencialmente más eficiente
                  que dedicar un día entero a estudiar. Clubmemo te ayuda a
                  mantener un hábito de estudio.
                </p>
              </CardContent>
            </Card>
            <Card className="max-w-80">
              <div className="pt-10 px-6">
                <div className="mx-auto w-fit">
                  <Shapes />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-center">
                  Práctica intercalada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Alternar entre distintos temas en una misma sesión de estudio
                  mejora la retención y el aprendizaje.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="h-16"></div>
          <p
            className={cn(
              textStyles.muted,
              "mx-auto px-8 text-center max-w-prose",
            )}
          >
            Crea tu cuenta en menos de 1 minuto
          </p>
          <div className="h-6" />
          <div className="mx-auto px-8 flex space-x-8 w-fit">
            <Button variant="default">Crear cuenta</Button>
          </div>
        </div>

        <div className="pt-32 pb-16">
          <h2 className={cn(textStyles.h2, "text-center px-8")}>
            Preguntas frecuentes
          </h2>
          <div className="h-8"></div>
          <div className="px-8">
            <div className="max-w-prose mx-auto">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    ¿Es gratuito? ¿Hay versión de pago?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="pb-2">
                      Clubmemo es gratuito. No hay versión de pago.
                    </p>
                    <p className="pb-2">
                      Se trata de un proyecto de código abierto que busca
                      mejorar la educación. Forma parte del proyecto de fin de
                      grado de Arnau Gómez, estudiante de ingeniería
                      informática.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
