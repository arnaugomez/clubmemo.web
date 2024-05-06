import type { ImportNotesTypeModel } from "./import-note-type-model";

export interface ImportNotesInputModel {
  profileId: string;
  courseId: string;
  importType: ImportNotesTypeModel;
  file: File;
}
