import { AiGeneratorNoteType } from "@/src/core/ai-generator/domain/models/ai-generator-note-type";
import { AiNotesGeneratorSourceType } from "@/src/core/ai-generator/domain/models/ai-notes-generator-source-type";
import { NoteRowModel } from "@/src/core/notes/domain/models/note-row-model";
import {
  CheckboxesFormField,
  FileFormField,
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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { generateAiNotesAction } from "../actions/generate-ai-notes-action";
import { textStyles } from "@/src/ui/styles/text-styles";

interface GenerateAiNotesFormProps {
  courseId: string;
  sourceType: AiNotesGeneratorSourceType;
  onGoBack: () => void;
  onSuccess: (notes: NoteRowModel[]) => void;
}

export function GenerateAiNotesForm({
  courseId,
  sourceType,
  onSuccess,
  onGoBack,
}: GenerateAiNotesFormProps) {
  const CreateNoteSchema = z.object({
    text:
      sourceType === AiNotesGeneratorSourceType.file
        ? z.string()
        : z.string().min(1).max(10_000),
    file:
      sourceType === AiNotesGeneratorSourceType.file
        ? z.instanceof(File)
        : z.instanceof(File).optional(),
    noteTypes: z
      .array(
        z.union([
          z.literal(AiGeneratorNoteType.definition),
          z.literal(AiGeneratorNoteType.list),
          z.literal(AiGeneratorNoteType.qa),
        ]),
      )
      .min(1),
    notesCount: z.number().int().positive(),
  });
  type FormValues = z.infer<typeof CreateNoteSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateNoteSchema),
    defaultValues: {
      notesCount: 10,
      noteTypes: [AiGeneratorNoteType.qa],
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const text = data.text ?? "";
      const response = await generateAiNotesAction({
        courseId,
        notesCount: data.notesCount,
        noteTypes: data.noteTypes,
        sourceType,
        text,
      });
      const handler = new FormResponseHandler(response, form);
      if (!handler.hasErrors && handler.data) {
        toast.success("Tarjetas generadas con éxito");
        console.log(handler.data);
        onSuccess(handler.data);
      }
      handler.setErrors();
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
          <h3 className={textStyles.h4}>Contenido de las tarjetas</h3>
          <div className="h-4"></div>
          {sourceType === AiNotesGeneratorSourceType.file && (
            <FileFormField
              accept={{
                "text/plain": [".txt"],
                "text/markdown": [".md"],
                "application/pdf": [".pdf"],
              }}
              name={"file"}
              label={"Archivo"}
              maxSize={800_000}
            />
          )}
          {sourceType === AiNotesGeneratorSourceType.text && (
            <TextareaFormField
              label="Texto"
              name="text"
              placeholder="Pega aquí tus apuntes"
            />
          )}
          {sourceType === AiNotesGeneratorSourceType.topic && (
            <InputFormField
              label="Tema"
              name="text"
              placeholder="Sobre qué quieres generar las tarjetas"
            />
          )}
          <div className="h-6" />
          <h3 className={textStyles.h4}>Opciones del generador</h3>
          <div className="h-4"></div>
          <CheckboxesFormField
            name="noteTypes"
            label="Tipos de tarjeta"
            description="¿Qué tipos de tarjetas quieres generar?"
            options={[
              {
                label: "Conceptos clave y definiciones",
                value: AiGeneratorNoteType.definition,
              },
              {
                label: "Listas y clasificaciones",
                value: AiGeneratorNoteType.list,
              },
              {
                label: "Preguntas y respuestas",
                value: AiGeneratorNoteType.qa,
              },
            ]}
          />
          <div className="h-4" />
          <FormGlobalErrorMessage />
        </div>
        <div className="h-6" />
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={onGoBack}
          >
            Volver
          </Button>
          <FormSubmitButton>Enviar</FormSubmitButton>
        </DialogFooter>
      </form>
    </Form>
  );
}
