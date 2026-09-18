import * as Schema from "effect/Schema";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { captureError } from "@/src/common/effect/client-runtime";
import { schemaResolver } from "@/src/common/effect/schema-resolver";
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
import { createNoteAction } from "../actions/create-note-action";

interface CreateNoteDialogProps {
  courseId: string;
  onClose: () => void;
  onSuccess: (note: NoteModel) => void;
}
const CreateNoteSchema = Schema.Struct({
  front: Schema.String.check(
    Schema.isMinLength(1, {
      message: `El texto debe contener al menos ${1} carácter(es)`,
    }),
  ).check(
    Schema.isMaxLength(1000, {
      message: `El texto debe contener como máximo ${1000} carácter(es)`,
    }),
  ),
  back: Schema.String.check(
    Schema.isMinLength(0, {
      message: `El texto debe contener al menos ${0} carácter(es)`,
    }),
  ).check(
    Schema.isMaxLength(10000, {
      message: `El texto debe contener como máximo ${10000} carácter(es)`,
    }),
  ),
});

type FormValues = (typeof CreateNoteSchema)["Type"];

export function CreateNoteDialog({
  courseId,
  onClose,
  onSuccess,
}: CreateNoteDialogProps) {
  const form = useForm<FormValues>({
    resolver: schemaResolver(CreateNoteSchema),
    defaultValues: {
      front: "",
      back: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const response = await createNoteAction({ courseId, ...data });
      const handler = new FormResponseHandler(response, form);
      if (!handler.hasErrors && handler.data) {
        toast.success("Tarjeta creada con éxito");
        onSuccess(new NoteModel(handler.data));
      }
      handler.setErrors();
    } catch (error) {
      captureError(error);
      FormResponseHandler.setGlobalError(form);
    }
  });
  useCommandEnter(onSubmit);

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open>
      <DialogContent onClose={isSubmitting ? undefined : onClose}>
        <DialogHeader>
          <DialogTitle>Añade una tarjeta</DialogTitle>
          <DialogDescription>
            Las tarjetas te permiten recordar conceptos o practicar preguntas de
            examen. Son una forma eficaz de ejercitar la memoria.
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
