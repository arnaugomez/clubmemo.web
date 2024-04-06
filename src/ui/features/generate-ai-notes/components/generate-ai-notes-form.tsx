import { AiGeneratorNoteType } from "@/src/core/ai-generator/domain/models/ai-generator-note-type";
import { NoteRowModel } from "@/src/core/notes/domain/models/note-row-model";
import {
  InputFormField,
  TextareaFormField,
} from "@/src/ui/components/form/form-fields";
import { FormGlobalErrorMessage } from "@/src/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/ui/components/form/form-submit-button";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { DialogFooter } from "@/src/ui/components/shadcn/ui/dialog";
import { Form } from "@/src/ui/components/shadcn/ui/form";
import { FormResponseHandler } from "@/src/ui/models/server-form-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface GenerateAiNotesFormProps {
  courseId: string;
  onSuccess: (notes: NoteRowModel[]) => void;
}
const CreateNoteSchema = z.object({
  text: z.string().optional(),
  file: z.instanceof(File).optional(),
  noteTypes: z.array(
    z.union([
      z.literal(AiGeneratorNoteType.definition),
      z.literal(AiGeneratorNoteType.list),
      z.literal(AiGeneratorNoteType.qa),
    ]),
  ),
  notesCount: z.number().int().positive(),
});

type FormValues = z.infer<typeof CreateNoteSchema>;

export function GenerateAiNotesForm({
  courseId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSuccess,
}: GenerateAiNotesFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(CreateNoteSchema),
    defaultValues: {
      notesCount: 10,
      noteTypes: [AiGeneratorNoteType.qa],
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = form.handleSubmit(async (data) => {
    try {
      // const response = await createNoteAction({ courseId, ...data });
      // const handler = new FormResponseHandler(response, form);
      // if (!handler.hasErrors && handler.data) {
      //   toast.success("Tarjeta creada con éxito");
      //   onSuccess(new NoteModel(handler.data));
      // }
      // handler.setErrors();
    } catch (error) {
      console.error(error);
      FormResponseHandler.setGlobalError(form);
    }
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div>
          <InputFormField
            label="Cara"
            name="front"
            placeholder="La pregunta o concepto que quieres recordar"
          />
          <div className="h-4" />
          <TextareaFormField
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
            asChild
          >
            <Link href={`/courses/detail/${courseId}`}>Volver</Link>
          </Button>
          <FormSubmitButton>Enviar</FormSubmitButton>
        </DialogFooter>
      </form>
    </Form>
  );
}
