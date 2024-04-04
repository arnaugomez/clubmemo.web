import { PaginationModel } from "@/src/core/app/domain/models/pagination-model";
import { CreateNoteInputModel } from "../models/create-note-input-model";
import { GetNotesInputModel } from "../models/get-notes-input-model";
import { NoteModel } from "../models/note-model";
import { UpdateNoteInputModel } from "../models/update-note-input-model";

export interface NotesRepository {
  createNote(input: CreateNoteInputModel): Promise<NoteModel>;
  getNote(noteId: string): Promise<NoteModel| null>;
  updateNote(input: UpdateNoteInputModel): Promise<void>;
  deleteNote(noteId: string): Promise<void>;
  getNotes(input: GetNotesInputModel): Promise<PaginationModel<NoteModel>>;
}
