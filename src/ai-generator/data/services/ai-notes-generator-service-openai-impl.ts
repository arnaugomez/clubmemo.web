import type { EnvService } from "@/src/common/domain/interfaces/env-service";
import type { ErrorTrackingService } from "@/src/common/domain/interfaces/error-tracking-service";
import type { NoteRowModel } from "@/src/notes/domain/models/note-row-model";
import { OpenAI, OpenAIError, RateLimitError } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z, ZodError } from "zod";
import {
  AiGeneratorEmptyMessageError,
  AiGeneratorError,
  AiGeneratorRateLimitError,
} from "../../domain/errors/ai-generator-errors";
import type {
  AiNotesGeneratorService,
  GenerateAiNotesInputModel,
} from "../../domain/interfaces/ai-notes-generator-service";
import { AiGeneratorNoteType } from "../../domain/models/ai-generator-note-type";
import { AiNotesGeneratorSourceType } from "../../domain/models/ai-notes-generator-source-type";
// eslint-disable-next-line @typescript-eslint/no-namespace
declare module global {
  /**
   * Singleton instance of the OpenAI client. Avoids creating multiple instances
   * of the client when the app hot reloads.
   */
  let openaiClient: OpenAI;
}

const ValidationSchema = z.object({
  flashcards: z.array(
    z.object({
      front: z.string(),
      back: z.string(),
    }),
  ),
});

/**
 * Implementation of AiNotesGeneratorService using the gpt-4o-mini model. It
 * communicates with the model using the OpenAI SDK, which makes requests to the
 * OpenAI API.
 */
export class AiNotesGeneratorServiceOpenaiImpl
  implements AiNotesGeneratorService
{
  /**
   * OpenAI client instance used to communicate with the AI
   */
  private readonly client: OpenAI;

  constructor(
    envService: EnvService,
    private readonly errorTrackingService: ErrorTrackingService,
  ) {
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
  }: GenerateAiNotesInputModel): Promise<NoteRowModel[]> {
    const typesMap = {
      [AiGeneratorNoteType.qa]: "a question and the answer",
      [AiGeneratorNoteType.definition]:
        "an important concept of the text and its definition",
      [AiGeneratorNoteType.list]: "a classification of the text and its items",
    };
    const textOrTopic =
      sourceType === AiNotesGeneratorSourceType.topic ? "topic" : "text";

    try {
      // This promise might take more than 10 seconds to resolve. Therefore, make sure the server is configured to handle long requests and not throw a timeout error.
      const completion = await this.client.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a flashard generator.
Output a list of flashcards. Each flashcard has a front side (the question) and a back side (the answer).
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
        model: "gpt-4o-mini",
        response_format: zodResponseFormat(ValidationSchema, "flashcards"),
        n: 1,
      });

      const message = completion.choices[0].message;
      const responseText = message.content;
      if (message.refusal || !responseText) {
        this.errorTrackingService.captureError(message);
        throw new AiGeneratorEmptyMessageError();
      }

      const response = JSON.parse(responseText);
      const parsed = ValidationSchema.parse(response);
      return parsed.flashcards;
    } catch (e) {
      if (e instanceof RateLimitError) {
        this.errorTrackingService.captureError(e);
        throw new AiGeneratorRateLimitError();
      } else if (e instanceof OpenAIError) {
        this.errorTrackingService.captureError(e);
        throw new AiGeneratorError();
      } else if (e instanceof ZodError) {
        this.errorTrackingService.captureError(e);
        throw new AiGeneratorError();
      }
      throw e;
    }
  }
}
