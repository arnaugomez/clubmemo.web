import * as Schema from "effect/Schema";

import { AiGeneratorNoteType } from "@/src/ai-generator/domain/models/ai-generator-note-type";
import { AiNotesGeneratorSourceType } from "@/src/ai-generator/domain/models/ai-notes-generator-source-type";

/**
 * Validates the parameters of `generateAiNotesAction`
 */
export const GenerateAiNotesActionSchema = Schema.Struct({
  sourceType: Schema.Union([
    Schema.Literal(AiNotesGeneratorSourceType.file),
    Schema.Literal(AiNotesGeneratorSourceType.text),
    Schema.Literal(AiNotesGeneratorSourceType.topic),
  ]),
  text: Schema.String.check(
    Schema.isMinLength(1, {
      message: `El texto debe contener al menos ${1} carácter(es)`,
    }),
  ).check(
    Schema.isMaxLength(60_000, {
      message: `El texto debe contener como máximo ${60_000} carácter(es)`,
    }),
  ),
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
    .check(Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }))
    .check(
      Schema.isGreaterThan(0, { message: "El número debe ser mayor que 0" }),
    ),
});

/**
 * Parameters of `generateAiNotesAction`
 */
export type GenerateAiNotesActionModel =
  (typeof GenerateAiNotesActionSchema)["Type"];
