"use client";
import { NoteModel } from "@/src/core/notes/domain/models/note-model";
import { AsyncButton } from "@/src/ui/components/button/async-button";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/components/shadcn/ui/dialog";
import { FormResponseHandler } from "@/src/ui/models/server-form-errors";
import { toast } from "sonner";
import { deleteNoteAction } from "../actions/delete-note-action";

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
      console.error(error);
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
