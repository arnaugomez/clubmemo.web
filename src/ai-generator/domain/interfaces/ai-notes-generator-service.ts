import type { AiGeneratorNoteType } from "../models/ai-generator-note-type";
import type { AiNotesGeneratorSourceType } from "../models/ai-notes-generator-source-type";

export interface GenerateAiNotesInputModel {
  text: string;
  noteTypes: AiGeneratorNoteType[];
  notesCount: number;
  sourceType: AiNotesGeneratorSourceType;
}

export interface AiNotesGeneratorService {
  generate(input: GenerateAiNotesInputModel): Promise<string[][]>;
}
