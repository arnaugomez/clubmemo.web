import { EnvService } from "@/src/core/common/domain/interfaces/env-service";
import { OpenAI } from "openai";
import {
  AiNotesGeneratorService,
  GenerateAiNotesInputModel,
} from "../../domain/interfaces/ai-notes-generator-service";
import { AiGeneratorNoteType } from "../../domain/models/ai-generator-note-type";
import { AiNotesGeneratorSourceType } from "../../domain/models/ai-notes-generator-source-type";
// eslint-disable-next-line @typescript-eslint/no-namespace
declare module global {
  let openaiClient: OpenAI;
}

export class AiNotesGeneratorServiceImpl implements AiNotesGeneratorService {
  private readonly client: OpenAI;
  constructor(envService: EnvService) {
    global.openaiClient ??= new OpenAI({
      apiKey: envService.openaiApiKey,
    });
    this.client = global.openaiClient;
  }
  async generate({
    text,
    noteTypes,
    notesCount,
    sourceType,
  }: GenerateAiNotesInputModel): Promise<string[][]> {
    const typesMap = {
      [AiGeneratorNoteType.qa]: "a question and the answer",
      [AiGeneratorNoteType.definition]:
        "an important concept of the text and its definition",
      [AiGeneratorNoteType.list]: "a classification of the text and its items",
    };
    const textOrTopic =
      sourceType === AiNotesGeneratorSourceType.topic ? "topic" : "text";

    const completion = await this.client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a flashard generator.
Output a list of flashcards in JSON format. The JSON should be an array of arrays, where each sub-array contains two strings: the question and the answer.
The flashcards can contain: ${noteTypes.map((type) => typesMap[type]).join(", ")}.
You must generate ${notesCount} flashcards based on the ${textOrTopic} provided by the user.
The language of the flashcards should be the language of the ${textOrTopic} provided by the user.
`,
        },
        {
          role: "user",
          content: `Generate ${notesCount} flashcards to help me study this ${textOrTopic}: ${text}`,
        },
      ],
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
      n: 1,
    });
    const responseText = completion.choices[0].message.content;
    if (!responseText) {
      // TODO: use a proper error
      throw new Error("Failed to generate notes");
    }
    const response = JSON.parse(responseText);
    return this.parseResponse(response);
  }

  private parseResponse(response: unknown): string[][] {
    if (!response) {
      return [];
    }
    if (Array.isArray(response)) {
      return response;
    }
    if (typeof response === "object") {
      for (const value of Object.values(response)) {
        if (Array.isArray(value)) {
          return value;
        }
      }
    }
    return [];
  }
}
