import * as Schema from "effect/Schema";

import { FileSchema } from "@/src/common/schemas/file-schema";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";
import { ImportNotesTypeModel } from "@/src/notes/domain/models/import-note-type-model";

/**
 * Validates the parameters of `importNotesAction`
 */
export const ImportNotesActionSchema = Schema.Struct({
  file: FileSchema,
  courseId: ObjectIdSchema,
  importType: Schema.Union([
    Schema.Literal(ImportNotesTypeModel.anki),
    Schema.Literal(ImportNotesTypeModel.csv),
    Schema.Literal(ImportNotesTypeModel.json),
  ]),
});

/**
 * Parameters of `importNotesAction`
 */
export type ImportNotesActionModel = (typeof ImportNotesActionSchema)["Type"];
