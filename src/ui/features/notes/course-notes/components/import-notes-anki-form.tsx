import { ImportNotesTypeModel } from "@/src/core/notes/domain/models/import-note-type-model";
import { NoteModel } from "@/src/core/notes/domain/models/note-model";
import { FileFormField } from "@/src/ui/components/form/form-fields";
import { FormGlobalErrorMessage } from "@/src/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/ui/components/form/form-submit-button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/src/ui/components/shadcn/ui/alert";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { DialogFooter } from "@/src/ui/components/shadcn/ui/dialog";
import { Form } from "@/src/ui/components/shadcn/ui/form";
import { FormResponseHandler } from "@/src/ui/models/server-form-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleHelp, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { importNotesAction } from "../actions/import-notes-action";

interface ImportNotesAnkiFormProps {
  courseId: string;
  setIsLoading: (loading: boolean) => void;
  onClose: () => void;
  onSuccess: (notes: NoteModel[]) => void;
}
const Schema = z.object({
  file: z.instanceof(File),
});

type FormValues = z.infer<typeof Schema>;

export function ImportNotesAnkiForm({
  courseId,
  setIsLoading,
  onClose,
  onSuccess,
}: ImportNotesAnkiFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {},
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("courseId", courseId);
      formData.append("importType", ImportNotesTypeModel.anki);
      const response = await importNotesAction(formData);
      const handler = new FormResponseHandler(response, form);
      if (!handler.hasErrors && handler.data) {
        toast.success("Tarjetas importadas con éxito");
        const newNotes = handler.data.map((e) => new NoteModel(e));
        onSuccess(newNotes);
      }
      handler.setErrors();
    } catch (error) {
      console.error(error);
      FormResponseHandler.setGlobalError(form);
    }
    setIsLoading(false);
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div>
          <div className="h-4"></div>
          <Alert>
            <CircleHelp size={16} />
            <AlertTitle>¿Cómo exportar tarjetas de Anki?</AlertTitle>
            <AlertDescription>
              ClubMemo soporta la importación de tarjetas en{" "}
              <span className="font-medium">texto plano</span>. Lee el{" "}
              <a
                className="underline"
                href="https://docs.ankiweb.net/exporting.html#text-files"
                target="_blank"
                rel="noopener noreferrer"
              >
                manual de ayuda de Anki
              </a>{" "}
              para aprender a exportar tus tarjetas en este formato.
            </AlertDescription>
          </Alert>

          <div className="h-6"></div>
          <FileFormField
            label="Archivo Anki (texto plano)"
            name="file"
            accept={{
              "text/plain": [".txt"],
            }}
            maxSize={800_000}
            fileIcon={<FileText />}
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
    </Form>
  );
}
