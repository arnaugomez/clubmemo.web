import { ImportNotesTypeModel } from "@/src/core/notes/domain/models/import-note-type-model";
import { ObjectId } from "mongodb";
import { z } from "zod";

export const ImportNotesActionSchema = z.object({
  file: z.instanceof(File),
  courseId: z.string().refine(ObjectId.isValid),
  importType: z.union([
    z.literal(ImportNotesTypeModel.anki),
    z.literal(ImportNotesTypeModel.csv),
    z.literal(ImportNotesTypeModel.json),
  ]),
});

export type ImportNotesActionModel = z.infer<typeof ImportNotesActionSchema>;
