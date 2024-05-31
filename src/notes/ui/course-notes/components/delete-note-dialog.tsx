"use client";
import { AsyncButton } from "@/src/common/ui/components/button/async-button";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/common/ui/components/shadcn/ui/dialog";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import type { NoteModel } from "@/src/notes/domain/models/note-model";
import { toast } from "sonner";
import { deleteNoteAction } from "../actions/delete-note-action";
import { clientLocator } from "@/src/common/di/client-locator";

interface DeleteNoteDialogProps {
  note: NoteModel;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteNoteDialog({
  note,
  onClose,
  onSuccess,
}: DeleteNoteDialogProps) {
  async function onDelete() {
    try {
      const response = await deleteNoteAction({ noteId: note.id });
      const handler = new FormResponseHandler(response);
      if (!handler.hasErrors) {
        toast.success("Tarjeta eliminada");
        onSuccess();
      }
      handler.toastErrors();
    } catch (error) {
      clientLocator.ErrorTrackingService().captureError(error);
      toast.error("Error al eliminar la tarjeta");
    }
  }

  return (
    <Dialog open>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle className="mr-4">
            ¿Quieres eliminar la tarjeta?
          </DialogTitle>
          <DialogDescription>Esta acción es irreversible.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Volver
          </Button>
          <AsyncButton onClick={onDelete} variant="destructive">
            Eliminar
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
