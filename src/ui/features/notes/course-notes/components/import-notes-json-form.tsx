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
import { CircleHelp, FileJson } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { importNotesAction } from "../actions/import-notes-action";

interface ImportNotesJsonFormProps {
  courseId: string;
  setIsLoading: (loading: boolean) => void;
  onClose: () => void;
  onSuccess: (notes: NoteModel[]) => void;
}
const Schema = z.object({
  file: z.instanceof(File),
});

type FormValues = z.infer<typeof Schema>;

export function ImportNotesJsonForm({
  courseId,
  setIsLoading,
  onClose,
  onSuccess,
}: ImportNotesJsonFormProps) {
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
      formData.append("importType", ImportNotesTypeModel.json);
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
            <AlertTitle>¿Qué formato debe tener el JSON?</AlertTitle>
            <AlertDescription>
              El archivo JSON debe tener un formato válido.{" "}
              <a
                className="underline"
                href="/json-schema/import-notes.schema.json"
                download
              >
                Descarga el JSONSchema
              </a>{" "}
              o echa un ojo a{" "}
              <a
                className="underline"
                href="/examples/import-notes-example.json"
                download
              >
                este ejemplo
              </a>
              .
            </AlertDescription>
          </Alert>

          <div className="h-6"></div>
          <FileFormField
            label="Archivo JSON"
            name="file"
            accept={{
              "application/json": [".json"],
            }}
            maxSize={800_000}
            fileIcon={<FileJson />}
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
