import { NoteRowModel } from "@/src/core/notes/domain/models/note-row-model";
import { AsyncButton } from "@/src/ui/components/button/async-button";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { Card } from "@/src/ui/components/shadcn/ui/card";
import { DialogFooter } from "@/src/ui/components/shadcn/ui/dialog";
import { Separator } from "@/src/ui/components/shadcn/ui/separator";
import { ActionResponseHandler } from "@/src/ui/models/action-response-handler";
import { textStyles } from "@/src/ui/styles/text-styles";
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
  router.prefetch(`/courses/detail/${courseId}`);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const onClick = async () => {
    setIsSubmitting(true);
    try {
      const result = await generateAiNotesConfirmAction({ courseId, notes });
      const handler = new ActionResponseHandler(result);
      if (!handler.hasErrors) {
        toast.success("Tarjetas añadidas correctamente");
        router.push(`/courses/detail/${courseId}`);
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
            <div className="flex-1 flex px-4 py-3 space-x-3">
              <h3 className="flex-1 font-medium py-2">{note.front}</h3>
              <Button
                onClick={() => onRemove(index)}
                size="icon"
                variant="secondary"
              >
                <Trash2 />
              </Button>
            </div>
            <Separator />
            <div className="flex-1 flex  px-4 py-5">
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
