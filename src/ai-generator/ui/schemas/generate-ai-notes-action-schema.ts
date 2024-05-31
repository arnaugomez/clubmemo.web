import { z } from "@/i18n/zod";
import { AiGeneratorNoteType } from "@/src/ai-generator/domain/models/ai-generator-note-type";
import { AiNotesGeneratorSourceType } from "@/src/ai-generator/domain/models/ai-notes-generator-source-type";

/**
 * Validates the parameters of `generateAiNotesAction`
 */
export const GenerateAiNotesActionSchema = z.object({
  sourceType: z.union([
    z.literal(AiNotesGeneratorSourceType.file),
    z.literal(AiNotesGeneratorSourceType.text),
    z.literal(AiNotesGeneratorSourceType.topic),
  ]),
  text: z.string().min(1).max(20_000),
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

/**
 * Parameters of `generateAiNotesAction`
 */
export type GenerateAiNotesActionModel = z.infer<
  typeof GenerateAiNotesActionSchema
>;
