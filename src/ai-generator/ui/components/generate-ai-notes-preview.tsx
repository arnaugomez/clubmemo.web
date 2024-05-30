import { AsyncButton } from "@/src/common/ui/components/button/async-button";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { Card } from "@/src/common/ui/components/shadcn/ui/card";
import { DialogFooter } from "@/src/common/ui/components/shadcn/ui/dialog";
import { Separator } from "@/src/common/ui/components/shadcn/ui/separator";
import { ActionResponseHandler } from "@/src/common/ui/models/action-response-handler";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { getCourseDetailPath } from "@/src/courses/ui/utils/get-course-detail-path";
import type { NoteRowModel } from "@/src/notes/domain/models/note-row-model";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { generateAiNotesConfirmAction } from "../actions/generate-ai-notes-confirm-action";

interface GenerateAiNotesPreviewProps {
  courseId: string;
  notes: NoteRowModel[];
  onRemove: (index: number) => void;
  onCancel: () => void;
}
export function GenerateAiNotesPreview({
  courseId,
  notes,
  onCancel,
  onRemove,
}: GenerateAiNotesPreviewProps) {
  const router = useRouter();
  const courseDetailPath = getCourseDetailPath(courseId);
  router.prefetch(courseDetailPath);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const onClick = async () => {
    setIsSubmitting(true);
    try {
      const result = await generateAiNotesConfirmAction({ courseId, notes });
      const handler = new ActionResponseHandler(result);
      if (!handler.hasErrors) {
        toast.success("Tarjetas añadidas correctamente");
        router.push(courseDetailPath);
      }
      handler.toastErrors();
    } catch (e) {
      toast.error("Error al añadir las tarjetas");
    }
    setIsSubmitting(false);
  };
  return (
    <>
      <div className={textStyles.h2}>Tarjetas generadas</div>
      <div className="h-2"></div>
      <p className={textStyles.base}>
        El generador AI ha generado las siguientes tarjetas. Elimina las que no
        te gusten, y no te olvides de pulsar al botón de Enviar para añadirlas a
        tu curso.
      </p>
      <div className="h-6"></div>
      <div className="space-y-4">
        {notes.map((note, index) => (
          <Card
            key={"note" + index}
            className="flex flex-col items-stretch overflow-clip"
          >
            <div className="flex flex-1 space-x-3 px-4 py-3">
              <h3 className="flex-1 py-2 font-medium">{note.front}</h3>
              <Button
                onClick={() => onRemove(index)}
                size="icon"
                variant="secondary"
              >
                <Trash2 />
              </Button>
            </div>
            <Separator />
            <div className="flex flex-1  px-4 py-5">
              <p className="flex-1">{note.back || "Tarjeta sin contenido"}</p>
            </div>
          </Card>
        ))}
      </div>
      <div className="h-6"></div>
      <DialogFooter>
        <Button
          type="button"
          variant="secondary"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          Volver
        </Button>
        <AsyncButton onClick={onClick}>Enviar</AsyncButton>
      </DialogFooter>
    </>
  );
}
