import { AiGeneratorNoteType } from "../models/ai-generator-note-type";

export interface AiGenerateNotesInput {
  text: string;
  noteTypes: AiGeneratorNoteType[];
  notesCount: number;
}
export interface AiNotesGeneratorService {
  generateNotes(input: AiGenerateNotesInput): Promise<string[][]>;
}
