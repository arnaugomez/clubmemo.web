import type { PaginationModel } from "@/src/common/domain/models/pagination-model";
import type { CopyNotesInputModel } from "../models/copy-notes-input-model";
import type { CreateNoteInputModel } from "../models/create-note-input-model";
import type { GetNotesInputModel } from "../models/get-notes-input-model";
import type { NoteModel } from "../models/note-model";
import type { NoteRowModel } from "../models/note-row-model";
import type { UpdateNoteInputModel } from "../models/update-note-input-model";

export interface NotesRepository {
  create(input: CreateNoteInputModel): Promise<NoteModel>;
  getDetail(noteId: string): Promise<NoteModel | null>;
  update(input: UpdateNoteInputModel): Promise<void>;
  delete(noteId: string): Promise<void>;
  get(input: GetNotesInputModel): Promise<PaginationModel<NoteModel>>;

  copy(input: CopyNotesInputModel): Promise<void>;

  getAllRows(courseId: string): Promise<NoteRowModel[]>;
  createMany(courseId: string, notes: NoteRowModel[]): Promise<NoteModel[]>;
}
