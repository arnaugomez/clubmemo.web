import type { ImportNotesTypeModel } from "./import-note-type-model";

export interface ImportNotesInputModel {
  courseId: string;
  importType: ImportNotesTypeModel;
  file: File;
}
