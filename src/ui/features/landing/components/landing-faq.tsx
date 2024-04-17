import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/ui/components/shadcn/ui/accordion";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";

export function LandingFaq() {
  return (
    <div className="pb-16 pt-32">
      <h2 className={cn(textStyles.h2, "px-8 text-center")}>
        Preguntas frecuentes
      </h2>
      <div className="h-8"></div>
      <div className="px-8">
        <div className="mx-auto max-w-prose">
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
                  Se trata de un proyecto de código abierto que busca mejorar la
                  educación. Forma parte del proyecto de fin de grado de Arnau
                  Gómez, estudiante de ingeniería informática.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
