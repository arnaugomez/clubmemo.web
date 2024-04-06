import { NoteModel } from "@/src/core/notes/domain/models/note-model";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/components/shadcn/ui/dialog";

interface ImportNotesDialogProps {
  courseId: string;
  onClose: () => void;
  onSuccess: (notes: NoteModel[]) => void;
}

export function ImportNotesDialog({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  courseId,
  onClose,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSuccess,
}: ImportNotesDialogProps) {
  return (
    <Dialog open>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Importar archivo</DialogTitle>
          <DialogDescription>
            Sube un archivo con tarjetas para añadirlas a este curso.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
