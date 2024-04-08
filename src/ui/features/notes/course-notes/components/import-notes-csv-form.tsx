import { ImportNotesTypeModel } from "@/src/core/notes/domain/models/import-note-type-model";
import { NoteModel } from "@/src/core/notes/domain/models/note-model";
import { FileFormField } from "@/src/ui/components/form/form-fields";
import { FormGlobalErrorMessage } from "@/src/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/ui/components/form/form-submit-button";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { DialogFooter } from "@/src/ui/components/shadcn/ui/dialog";
import { Form } from "@/src/ui/components/shadcn/ui/form";
import { FormResponseHandler } from "@/src/ui/models/server-form-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileSpreadsheet } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { importNotesAction } from "../actions/import-notes-action";

interface ImportNotesCsvFormProps {
  courseId: string;
  setIsLoading: (loading: boolean) => void;
  onClose: () => void;
  onSuccess: (notes: NoteModel[]) => void;
}
const Schema = z.object({
  file: z.instanceof(File),
});

type FormValues = z.infer<typeof Schema>;

export function ImportNotesCsvForm({
  courseId,
  setIsLoading,
  onClose,
  onSuccess,
}: ImportNotesCsvFormProps) {
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
      formData.append("importType", ImportNotesTypeModel.csv);
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
          <FileFormField
            label="Archivo CSV"
            name="file"
            accept={{
              "text/csv": [".csv"],
            }}
            maxSize={800_000}
            fileIcon={<FileSpreadsheet />}
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
