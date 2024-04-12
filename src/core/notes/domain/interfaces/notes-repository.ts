import { PaginationModel } from "@/src/core/common/domain/models/pagination-model";
import { CopyNotesInputModel } from "../models/copy-notes-input-model";
import { CreateNoteInputModel } from "../models/create-note-input-model";
import { GetNotesInputModel } from "../models/get-notes-input-model";
import { NoteModel } from "../models/note-model";
import { NoteRowModel } from "../models/note-row-model";
import { UpdateNoteInputModel } from "../models/update-note-input-model";

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
