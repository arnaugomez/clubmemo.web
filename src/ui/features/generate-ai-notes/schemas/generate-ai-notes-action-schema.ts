import { AiGeneratorNoteType } from "@/src/core/ai-generator/domain/models/ai-generator-note-type";
import { AiNotesGeneratorSourceType } from "@/src/core/ai-generator/domain/models/ai-notes-generator-source-type";
import { ObjectId } from "mongodb";
import { z } from "zod";

export const GenerateAiNotesActionSchema = z.object({
  courseId: z.string().refine(ObjectId.isValid),
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
