import { AiNotesGeneratorSourceType } from "@/src/core/ai-generator/domain/models/ai-notes-generator-source-type";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/ui/components/shadcn/ui/card";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { BookType, SquarePen, Upload } from "lucide-react";

interface GenerateAiNotesSourceSelectorProps {
  setSource: (source: AiNotesGeneratorSourceType) => void;
}

export function GenerateAiNotesSourceSelector({
  setSource,
}: GenerateAiNotesSourceSelectorProps) {
  return (
    <>
      <p className={cn(textStyles.muted, "text-center")}>Elige un generador</p>
      <div className="h-4"></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <Upload className="mx-auto size-8 text-slate-500" />
            <div className="h-1"></div>
            <CardTitle className="text-center">Subir archivo</CardTitle>
            <div className="h-2"></div>
            <CardDescription className="text-center">
              Sube un archivo de texto o PDF con tus apuntes
            </CardDescription>
          </CardHeader>
          <div className="h-4"></div>
          <CardFooter>
            <Button
              onClick={() => setSource(AiNotesGeneratorSourceType.file)}
              className="w-full"
            >
              Empezar
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <SquarePen className="mx-auto size-8 text-slate-500" />
            <div className="h-1"></div>
            <CardTitle className="text-center">Pegar texto</CardTitle>
            <div className="h-2"></div>
            <CardDescription className="text-center">
              Escribe o pega un texto con los apuntes de tus asignaturas
            </CardDescription>
          </CardHeader>
          <div className="h-4"></div>
          <CardFooter>
            <Button
              onClick={() => setSource(AiNotesGeneratorSourceType.text)}
              className="w-full"
            >
              Empezar
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <BookType className="mx-auto size-8 text-slate-500" />
            <div className="h-1"></div>

            <CardTitle className="text-center">Temático</CardTitle>
            <div className="h-2"></div>
            <CardDescription className="text-center">
              Genera tarjetas de aprendizaje sobre un determinado tema
            </CardDescription>
          </CardHeader>
          <div className="h-4"></div>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => setSource(AiNotesGeneratorSourceType.topic)}
            >
              Empezar
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
