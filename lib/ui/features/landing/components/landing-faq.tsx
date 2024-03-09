import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lib/ui/components/shadcn/ui/accordion";
import { textStyles } from "@/lib/ui/styles/text-styles";
import { cn } from "@/lib/ui/utils/shadcn";

export function LandingFaq() {
  return (
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
