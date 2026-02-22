import type { PropsWithChildren, ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/common/ui/components/shadcn/ui/accordion";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";

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
                  <Paragraph>
                    Clubmemo es gratuito. No hay versión de pago.
                  </Paragraph>
                  <Paragraph>
                    Se trata de un proyecto de código abierto que busca mejorar
                    la educación. Forma parte del proyecto de fin de grado de
                    Arnau Gómez, estudiante de Ingeniería Informática.
                  </Paragraph>
                </>
              }
            />
            <FaqItem
              value="item-2"
              question="¿Es compatible con Anki, Quizlet y otras apps de estudio eficiente?"
              answer={
                <>
                  <Paragraph>
                    ¡Sí! Puedes importar tus tarjetas de Anki, Quizlet y otras
                    aplicaciones y practicarlas en clubmemo.
                  </Paragraph>
                  <Paragraph>
                    Y si clubmemo no te convence, puedes exportar tus tarjetas
                    creadas en clubmemo a un formato compatible con Anki,
                    Quizlet y otras aplicaciones, y migrar tu estudio a otra app
                    sin problemas.
                  </Paragraph>
                  <Paragraph>
                    Además, clubmemo te da la flexibilidad de importar y
                    exportar los datos de tus tarjetas en formato JSON, CSV y
                    TXT.
                  </Paragraph>
                </>
              }
            />
            <FaqItem
              value="item-3"
              question="¿Cómo funciona la generación automática de tarjetas con AI?"
              answer={
                <>
                  <Paragraph>
                    Clubmemo utiliza inteligencia artificial para generar
                    automáticamente tarjetas de estudio a partir de textos y
                    PDF.
                  </Paragraph>
                  <Paragraph>
                    Hay 3 modalidades de generación automática de tarjetas: a
                    partir de un PDF, a partir de un texto y seleccionando un
                    determinado tema de estudio.
                  </Paragraph>
                  <Paragraph>
                    Tus datos están seguros. Clubmemo no almacena los textos ni
                    los PDFs que subes para generar tarjetas de estudio.
                  </Paragraph>
                </>
              }
            />
            <FaqItem
              value="item-4"
              question={
                '¿Por qué "clubmemo" sale escrito en minúscula en la aplicación?'
              }
              answer={
                <Paragraph>
                  Nos pareció que te sorprendería este detalle y que así te
                  acordarías de nuestro nombre 😉️
                </Paragraph>
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

function Paragraph({ children }: PropsWithChildren) {
  return <p className={cn(textStyles.p, "pb-2")}>{children}</p>;
}
