import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import * as SchemaGetter from "effect/SchemaGetter";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { AiGeneratorNoteType } from "@/src/ai-generator/domain/models/ai-generator-note-type";
import { AiNotesGeneratorSourceType } from "@/src/ai-generator/domain/models/ai-notes-generator-source-type";
import { captureError, runClient } from "@/src/common/effect/client-runtime";
import { schemaResolver } from "@/src/common/effect/schema-resolver";
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
import { DocumentTextService } from "../../domain/interfaces/document-text-service";
import { generateAiNotesAction } from "../actions/generate-ai-notes-action";

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
  const CreateNoteSchema = Schema.Struct({
    text:
      sourceType === AiNotesGeneratorSourceType.file
        ? Schema.optional(Schema.String)
        : Schema.String.pipe(
            Schema.decode({
              decode: SchemaGetter.transform((value) => value.trim()),
              encode: SchemaGetter.passthrough(),
            }),
          )
            .check(
              Schema.isMinLength(1, {
                message: `El texto debe contener al menos ${1} carácter(es)`,
              }),
            )
            .check(
              Schema.isMaxLength(60_000, {
                message: `El texto debe contener como máximo ${60_000} carácter(es)`,
              }),
            ),
    file:
      sourceType === AiNotesGeneratorSourceType.file
        ? FileSchema
        : Schema.optional(Schema.Undefined),
    noteTypes: Schema.mutable(
      Schema.Array(
        Schema.Union([
          Schema.Literal(AiGeneratorNoteType.definition),
          Schema.Literal(AiGeneratorNoteType.list),
          Schema.Literal(AiGeneratorNoteType.qa),
        ]),
      ),
    ).check(
      Schema.isMinLength(1, {
        message: `La lista debe contener al menos ${1} elemento(s)`,
      }),
    ),
    notesCount: Schema.Number.check(Schema.makeFilter((n) => !Number.isNaN(n)))
      .check(
        Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }),
      )
      .check(
        Schema.isGreaterThan(0, { message: "El número debe ser mayor que 0" }),
      ),
  });
  type FormValues = (typeof CreateNoteSchema)["Type"];

  const form = useForm<FormValues>({
    resolver: schemaResolver(CreateNoteSchema),
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

        const file = data.file;
        text = await runClient(
          Effect.gen(function* () {
            const reader = yield* DocumentTextService;
            return yield* reader.read(file);
          }),
        );
      }
      text = text.trim().slice(0, 60_000);
      if (!text) {
        form.setError("root.globalError", {
          type: "global",
          message: "El texto es vacío.",
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
      captureError(error);
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
