import { z } from "@/i18n/zod";
import { AiGeneratorNoteType } from "@/src/ai-generator/domain/models/ai-generator-note-type";
import { AiNotesGeneratorSourceType } from "@/src/ai-generator/domain/models/ai-notes-generator-source-type";
import { FileSchema } from "@/src/common/schemas/file-schema";
import { CheckboxesFormField } from "@/src/common/ui/components/form/checkboxes-form-field";
import { FileFormField } from "@/src/common/ui/components/form/file-form-field";
import { FormGlobalErrorMessage } from "@/src/common/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/common/ui/components/form/form-submit-button";
import { InputFormField } from "@/src/common/ui/components/form/input-form-field";
import { SliderFormField } from "@/src/common/ui/components/form/slider-form-field";
import { TextareaFormField } from "@/src/common/ui/components/form/textarea-form-field";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { DialogFooter } from "@/src/common/ui/components/shadcn/ui/dialog";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import type { NoteRowModel } from "@/src/notes/domain/models/note-row-model";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { generateAiNotesAction } from "../actions/generate-ai-notes-action";
import { locator_common_ErrorTrackingService } from "@/src/common/locators/locator_error-tracking-service";

interface GenerateAiNotesFormProps {
  /**
   * The type of data that the user will enter to generate the notes.
   * It can be a file, a text or a topic.
   */
  sourceType: AiNotesGeneratorSourceType;
  /**
   * Triggered when the user clicks on the go back button
   */
  onGoBack: () => void;
  /**
   * Triggered when the form is submitted without errors and a list of notes is
   * generated
   */
  onSuccess: (notes: NoteRowModel[]) => void;
}

/**
 * Displays a form with the AI notes generator options.
 * On submit, it generates the notes and calls the `onSuccess` callback
 */
export function GenerateAiNotesForm({
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
        ? FileSchema
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
        if (
          data.file.type.includes("text/plain") ||
          data.file.type.includes("md")
        ) {
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
              // @ts-expect-error pdfjsLib is loaded through a script
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const pdfjs = window.pdfjsLib;
              pdfjs.GlobalWorkerOptions.workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.mjs";
              const pdf = await pdfjs.getDocument(typedarray).promise;

              const numPages = pdf.numPages;

              const texts = await Promise.all(
                Array.from({ length: numPages }).map(async (_, i) => {
                  const page = await pdf.getPage(i + 1);
                  const content = await page.getTextContent();
                  return content.items
                    .map((item: { str: string }) =>
                      "str" in item ? item.str : "",
                    )
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
        notesCount: data.notesCount,
        noteTypes: data.noteTypes,
        sourceType,
        text,
      });
      const handler = new FormResponseHandler(response, form);
      if (!handler.hasErrors && handler.data) {
        if (handler.data?.length) {
          toast.success("Tarjetas generadas con éxito");
          onSuccess(handler.data);
        } else {
          form.setError("root.globalError", {
            type: "global",
            message:
              "El generador AI ha generado 0 tarjetas. Use otra entrada o inténtalo más tarde.",
          });
        }
      }
      handler.setErrors();
    } catch (error) {
      locator_common_ErrorTrackingService().captureError(error);
      FormResponseHandler.setGlobalError(form);
    }
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <FormProvider {...form}>
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
    </FormProvider>
  );
}
