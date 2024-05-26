import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/common/ui/components/shadcn/ui/accordion";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import type { ReactNode } from "react";

export function LandingFaq() {
  return (
    <div className="pb-16 pt-32">
      <h2 className={cn(textStyles.h2, "px-8 text-center")}>
        Preguntas frecuentes
      </h2>
      <div className="h-8" />
      <div className="px-8">
        <div className="mx-auto max-w-prose">
          <Accordion type="single" collapsible>
            <FaqItem
              value="item-1"
              question="¿Es gratuito? ¿Hay versión de pago?"
              answer={
                <>
                  <p className="pb-2">
                    Clubmemo es gratuito. No hay versión de pago.
                  </p>
                  <p className="pb-2">
                    Se trata de un proyecto de código abierto que busca mejorar
                    la educación. Forma parte del proyecto de fin de grado de
                    Arnau Gómez, estudiante de ingeniería informática.
                  </p>
                </>
              }
            />
            <FaqItem
              value="item-2"
              question="¿Es compatible con Anki, Quizlet y otras apps de estudio eficiente?"
              answer={
                <>
                  <p className="pb-2">
                    ¡Sí! Puedes importar tus tarjetas de Anki, Quizlet y otras
                    aplicaciones y practicarlas en Clubmemo.
                  </p>
                  <p className="pb-2">
                    Y si Clubmemo no te convence, puedes exportar tus tarjetas
                    creadas en Clubmemo a un formato compatible con Anki,
                    Quizlet y otras aplicaciones, y migrar tu estudio a otra app
                    sin problemas.
                  </p>
                  <p className="pb-2">
                    Además, clubmemo te da la flexibilidad de importar y
                    exportar los datos de tus tarjetas en formato JSON, CSV y
                    TXT.
                  </p>
                </>
              }
            />
            <FaqItem
              value="item-3"
              question="¿Cómo funciona la generación automática de tarjetas con AI?"
              answer={
                <>
                  <p className="pb-2">
                    Clubmemo utiliza inteligencia artificial para generar
                    automáticamente tarjetas de estudio a partir de textos y
                    PDF.
                  </p>
                  <p className="pb-2">
                    Hay 3 modalidades de generación automática de tarjetas: a
                    partir de un PDF, a partir de un texto y seleccionando un
                    determinado tema de estudio.
                  </p>
                  <p className="pb-2">
                    Tus datos están seguros. Clubmemo no almacena los textos ni
                    los PDFs que subes para generar tarjetas de estudio.
                  </p>
                </>
              }
            />
          </Accordion>
        </div>
      </div>
    </div>
  );
}

interface FaqItemViewModel {
  value: string;
  question: string;
  answer: ReactNode;
}

function FaqItem({ value, question, answer }: FaqItemViewModel) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger>{question}</AccordionTrigger>
      <AccordionContent>{answer}</AccordionContent>
    </AccordionItem>
  );
}
