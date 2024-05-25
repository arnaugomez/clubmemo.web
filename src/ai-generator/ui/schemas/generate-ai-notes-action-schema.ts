import { z } from "@/i18n/zod";
import { AiGeneratorNoteType } from "@/src/ai-generator/domain/models/ai-generator-note-type";
import { AiNotesGeneratorSourceType } from "@/src/ai-generator/domain/models/ai-notes-generator-source-type";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

export const GenerateAiNotesActionSchema = z.object({
  courseId: ObjectIdSchema,
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

export type GenerateAiNotesActionModel = z.infer<
  typeof GenerateAiNotesActionSchema
>;
