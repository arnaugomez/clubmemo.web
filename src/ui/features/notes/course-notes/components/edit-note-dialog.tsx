import { NoteModel } from "@/src/core/notes/domain/models/note-model";
import {
  InputFormField,
  WysiwygFormField,
} from "@/src/ui/components/form/form-fields";
import { FormGlobalErrorMessage } from "@/src/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/ui/components/form/form-submit-button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { editNoteAction } from "../actions/edit-note-action";

const EditNoteSchema = z.object({
  front: z.string().min(1).max(1000),
  back: z.string().min(0).max(10000),
});

type FormValues = z.infer<typeof EditNoteSchema>;

interface EditNoteDialogProps {
  note: NoteModel;
  onClose: () => void;
  onSuccess: (note: NoteModel) => void;
}
export function EditNoteDialog({
  note,
  onClose,
  onSuccess,
}: EditNoteDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(EditNoteSchema),
    defaultValues: {
      front: note.front,
      back: note.back,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const response = await editNoteAction({ id: note.id, ...data });
      const handler = new FormResponseHandler(response, form);
      if (!handler.hasErrors && handler.data) {
        toast.success("La tarjeta ha sido actualizada");
        onSuccess(new NoteModel(handler.data));
      }
      handler.setErrors();
    } catch (error) {
      console.error(error);
      FormResponseHandler.setGlobalError(form);
    }
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open>
      <DialogContent onClose={isSubmitting ? undefined : onClose}>
        <DialogHeader>
          <DialogTitle>Editar curso</DialogTitle>
          <DialogDescription>
            Modifica los datos del curso para personalizar tu experiencia y
            hacer que otros usuarios puedan encontrarlo y conocerlo mejor.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={onSubmit}>
            <div>
              <InputFormField
                label="Cara"
                name="front"
                placeholder="La pregunta o concepto que quieres recordar"
              />
              <div className="h-4" />
              <WysiwygFormField
                label="Revés"
                name="back"
                placeholder="La respuesta, definición o explicación"
              />
              <FormGlobalErrorMessage />
            </div>
            <div className="h-6" />
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={onClose}
              >
                Volver
              </Button>
              <FormSubmitButton>Enviar</FormSubmitButton>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
