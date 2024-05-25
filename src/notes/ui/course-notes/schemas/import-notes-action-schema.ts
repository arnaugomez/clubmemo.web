import { z } from "@/i18n/zod";
import { FileSchema } from "@/src/common/schemas/file-schema";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";
import { ImportNotesTypeModel } from "@/src/notes/domain/models/import-note-type-model";

export const ImportNotesActionSchema = z.object({
  file: FileSchema,
  courseId: ObjectIdSchema,
  importType: z.union([
    z.literal(ImportNotesTypeModel.anki),
    z.literal(ImportNotesTypeModel.csv),
    z.literal(ImportNotesTypeModel.json),
  ]),
});

export type ImportNotesActionModel = z.infer<typeof ImportNotesActionSchema>;
