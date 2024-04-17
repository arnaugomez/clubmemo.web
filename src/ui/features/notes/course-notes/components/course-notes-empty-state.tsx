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
import { Layers, Sparkles, SquarePen, Upload } from "lucide-react";
import Link from "next/link";
import { CreateNoteButton } from "./create-note-button";
import { ImportNotesButton } from "./import-notes-button";

interface CourseNotesEmptyStateProps {
  courseId: string;
}

export function CourseNotesEmptyState({
  courseId,
}: CourseNotesEmptyStateProps) {
  return (
    <div>
      <div className="flex justify-center">
        <Layers className={cn(textStyles.muted, "size-5")} />
      </div>
      <div className="h-4"></div>
      <p
        className={cn(textStyles.muted, "mx-auto max-w-80 text-center text-sm")}
      >
        Este curso no tiene tarjetas. Añádelas con uno de los siguientes
        métodos:
      </p>
      <div className="h-8"></div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <SquarePen className="mx-auto size-8 text-slate-500" />
            <div className="h-1"></div>
            <CardTitle className="truncate text-center">Manualmente</CardTitle>
            <div className="h-2"></div>
            <CardDescription className="text-center">
              Añade y edita tus tarjetas con el editor de texto avanzado.
              Personaliza el contenido a tu medida.
            </CardDescription>
          </CardHeader>
          <div className="h-4"></div>
          <CardFooter>
            <CreateNoteButton courseId={courseId} className="w-full">
              Empezar
            </CreateNoteButton>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <Sparkles className="mx-auto size-8 text-slate-500" />
            <div className="h-1"></div>
            <CardTitle className="truncate text-center">Generador AI</CardTitle>
            <div className="h-2"></div>
            <CardDescription className="text-center">
              Sube tus apuntes en formato texto o PDF y deja que nuestra
              inteligencia artificial genere las tarjetas por ti.
            </CardDescription>
          </CardHeader>
          <div className="h-4"></div>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href={`/courses/detail/${courseId}/ai-generator`}>
                Empezar
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="sm:col-span-2">
          <CardHeader>
            <Upload className="mx-auto size-8 text-slate-500" />
            <div className="h-1"></div>

            <CardTitle className="text-center">Importar archivo</CardTitle>
            <div className="h-2"></div>
            <CardDescription className="mx-auto max-w-sm text-center">
              Importa tarjetas de otras plataformas con un solo clic. Soportamos
              varios formatos: CSV, JSON, Anki...
            </CardDescription>
          </CardHeader>
          <div className="h-2"></div>
          <CardFooter>
            <ImportNotesButton courseId={courseId} />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
