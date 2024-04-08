import { AiGeneratorNoteType } from "@/src/core/ai-generator/domain/models/ai-generator-note-type";
import { AiNotesGeneratorSourceType } from "@/src/core/ai-generator/domain/models/ai-notes-generator-source-type";
import { NoteRowModel } from "@/src/core/notes/domain/models/note-row-model";
import {
  CheckboxesFormField,
  FileFormField,
  InputFormField,
  SliderFormField,
  TextareaFormField,
} from "@/src/ui/components/form/form-fields";
import { FormGlobalErrorMessage } from "@/src/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/ui/components/form/form-submit-button";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { DialogFooter } from "@/src/ui/components/shadcn/ui/dialog";
import { Form } from "@/src/ui/components/shadcn/ui/form";
import { FormResponseHandler } from "@/src/ui/models/server-form-errors";
import { textStyles } from "@/src/ui/styles/text-styles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { generateAiNotesAction } from "../actions/generate-ai-notes-action";

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
        ? z.string().optional()
        : z.string().min(1).max(20_000),
    file:
      sourceType === AiNotesGeneratorSourceType.file
        ? z.instanceof(File)
        : z.undefined(),
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
      text: "",
      notesCount: 10,
      noteTypes: [AiGeneratorNoteType.qa],
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      let text = data.text ?? "";
      if (sourceType === AiNotesGeneratorSourceType.file) {
        if (!data.file) {
          form.setError("file", { message: "Debes subir un archivo" });
          return;
        }
        if (data.file.type.includes("txt") || data.file.type.includes("md")) {
          text = await data.file.text();
        } else if (data.file.type.includes("pdf")) {
          const fileReader = new FileReader();
          fileReader.readAsArrayBuffer(data.file);
          text = await new Promise((resolve, reject) => {
            fileReader.onload = async (event) => {
              if (
                !event.target ||
                !event.target.result ||
                typeof event.target.result === "string"
              ) {
                reject(new Error("No se pudo leer el archivo"));
                return;
              }
              const typedarray = new Uint8Array(event.target.result);
              const pdfjs = await import("pdfjs-dist");
              pdfjs.GlobalWorkerOptions.workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs";
              const pdf = await pdfjs.getDocument(typedarray).promise;

              const numPages = pdf.numPages;

              const texts = await Promise.all(
                Array.from({ length: numPages }).map(async (_, i) => {
                  const page = await pdf.getPage(i + 1);
                  const content = await page.getTextContent();
                  return content.items
                    .map((item) => ("str" in item ? item.str : ""))
                    .join(" ");
                }),
              );
              resolve(texts.join("\n"));
            };
          });
        }
      }
      text = text.trim().slice(0, 20_000);
      if (!text) {
        form.setError("root.globalError", {
          type: "global",
          message: "The text is empty.",
        });
        return;
      }
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
          <div className="h-8" />
          <h3 className={textStyles.h4}>Opciones del generador</h3>
          <div className="h-4"></div>
          <SliderFormField
            label="Número de tarjetas"
            name="notesCount"
            max={20}
          />
          <div className="h-6"></div>
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
