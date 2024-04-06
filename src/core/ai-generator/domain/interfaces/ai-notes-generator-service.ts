import { AiGeneratorNoteType } from "../models/ai-generator-note-type";

export interface GenerateAiNotesInputModel {
  text: string;
  noteTypes: AiGeneratorNoteType[];
  notesCount: number;
}

export interface AiNotesGeneratorService {
  generate(input: GenerateAiNotesInputModel): Promise<string[][]>;
}
