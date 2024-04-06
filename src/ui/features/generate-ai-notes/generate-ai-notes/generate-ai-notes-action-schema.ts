import { AiGeneratorNoteType } from "@/src/core/ai-generator/domain/models/ai-generator-note-type";
import { ObjectId } from "mongodb";
import { z } from "zod";

export const GenerateAiNotesActionSchema = z.object({
  courseId: z.string().refine(ObjectId.isValid),
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
