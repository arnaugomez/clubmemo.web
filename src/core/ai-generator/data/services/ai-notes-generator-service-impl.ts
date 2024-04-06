import { EnvService } from "@/src/core/app/domain/interfaces/env-service";
import { OpenAI } from "openai";
import {
  AiGenerateNotesInput,
  AiNotesGeneratorService,
} from "../../domain/interfaces/ai-notes-generator-service";
import { AiGeneratorNoteType } from "../../domain/models/ai-generator-note-type";
// eslint-disable-next-line @typescript-eslint/no-namespace
declare module global {
  let openaiClient: OpenAI;
}

export class AiNotesGeneratorServiceImpl implements AiNotesGeneratorService {
  private readonly client: OpenAI;
  constructor(envService: EnvService) {
    this.client =
      global.openaiClient ??
      new OpenAI({
        apiKey: envService.openaiApiKey,
      });
    global.openaiClient = this.client;
  }
  async generateNotes({
    text,
    noteTypes,
    notesCount,
  }: AiGenerateNotesInput): Promise<string[][]> {
    const typesMap = {
      [AiGeneratorNoteType.qa]: "a question and the answer",
      [AiGeneratorNoteType.definition]:
        "an important concept of the text and its definition",
      [AiGeneratorNoteType.list]: "a classification of the text and its items",
    };
    const completion = await this.client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
          You are a flashard generator.
          Output a list of flashcards in JSON format. The JSON should be an array of arrays, where each sub-array contains two strings: the question and the answer.
          The flashcards can contain: ${noteTypes.map((type) => typesMap[type]).join(", ")}.
          You must generate ${notesCount} flashcards based on the text provided by the user.
          The language of the flashcards should be the language of the text provided by the user.
          `,
        },
        {
          role: "user",
          content: `Generate ${notesCount} flashcards to help me study this text: ${text}`,
        },
      ],
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
      n: 1,
    });
    console.log(completion.choices[0].message.content);
    return [["note1", "note2"]];
  }
}
