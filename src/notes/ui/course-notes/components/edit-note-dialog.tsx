import { z } from "@/i18n/zod";
import { FormGlobalErrorMessage } from "@/src/common/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/common/ui/components/form/form-submit-button";
import { WysiwygFormField } from "@/src/common/ui/components/form/wysiwyg-form-field";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/common/ui/components/shadcn/ui/dialog";
import { useCommandEnter } from "@/src/common/ui/hooks/use-command-enter";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import { NoteModel } from "@/src/notes/domain/models/note-model";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { editNoteAction } from "../actions/edit-note-action";
import { locator_common_ErrorTrackingService } from "@/src/common/locators/locator_error-tracking-service";

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
      locator_common_ErrorTrackingService().captureError(error);
      FormResponseHandler.setGlobalError(form);
    }
  });
  useCommandEnter(onSubmit);

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
              <WysiwygFormField
                label="Cara"
                name="front"
                placeholder="La pregunta o concepto que quieres recordar"
                isSmall
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
