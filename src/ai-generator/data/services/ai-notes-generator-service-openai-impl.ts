import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as Schema from "effect/Schema";
import { OpenAI, OpenAIError, RateLimitError } from "openai";
import type { EnvService } from "@/src/common/domain/interfaces/env-service";
import type { ErrorTrackingService } from "@/src/common/domain/interfaces/error-tracking-service";
import { ExternalServiceError } from "@/src/common/effect/errors";
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

const ValidationSchema = Schema.Struct({
  flashcards: Schema.mutable(
    Schema.Array(
      Schema.Struct({
        front: Schema.String,
        back: Schema.String,
      }),
    ),
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
  private cachedClient: OpenAI | undefined;
  private get client(): OpenAI {
    this.cachedClient ??= new OpenAI({
      apiKey: Redacted.value(this.envService.openaiApiKey),
    });
    return this.cachedClient;
  }

  constructor(
    private readonly envService: EnvService,
    private readonly errorTrackingService: ErrorTrackingService,
  ) {}

  generate = Effect.fn("AiNotesGeneratorServiceOpenaiImpl.generate")(function* (
    this: AiNotesGeneratorServiceOpenaiImpl,
    { text, noteTypes, notesCount, sourceType }: GenerateAiNotesInputModel,
  ) {
    const typesMap = {
      [AiGeneratorNoteType.qa]: "a question and the answer",
      [AiGeneratorNoteType.definition]:
        "an important concept of the text and its definition",
      [AiGeneratorNoteType.list]: "a classification of the text and its items",
    };
    const textOrTopic =
      sourceType === AiNotesGeneratorSourceType.topic ? "topic" : "text";

    return yield* Effect.gen(
      function* (this: AiNotesGeneratorServiceOpenaiImpl) {
        // This promise might take more than 10 seconds to resolve. Therefore, make sure the server is configured to handle long requests and not throw a timeout error.
        const completion = yield* Effect.tryPromise({
          try: (signal) =>
            this.client.chat.completions.create(
              {
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
                response_format: {
                  type: "json_schema",
                  json_schema: {
                    name: "flashcards",
                    strict: true,
                    schema: Schema.toJsonSchemaDocument(ValidationSchema, {
                      onExcessProperty: "error",
                    }).schema,
                  },
                },
                n: 1,
              },
              { signal },
            ),
          catch: (cause) =>
            new ExternalServiceError({
              operation: "AiNotesGeneratorServiceOpenaiImpl.generate",
              cause,
            }),
        });

        const message = completion.choices[0].message;
        const responseText = message.content;
        if (message.refusal || !responseText) {
          yield* this.errorTrackingService.captureError(message);
          return yield* Effect.fail(new AiGeneratorEmptyMessageError());
        }

        const parsed = yield* Schema.decodeUnknownEffect(
          Schema.fromJsonString(ValidationSchema),
        )(responseText);
        return parsed.flashcards;
      }.bind(this),
    ).pipe(
      Effect.catch((e) =>
        Effect.gen(
          function* (this: AiNotesGeneratorServiceOpenaiImpl) {
            const cause = e instanceof ExternalServiceError ? e.cause : e;
            if (cause instanceof RateLimitError) {
              yield* this.errorTrackingService.captureError(e);
              return yield* Effect.fail(new AiGeneratorRateLimitError());
            } else if (cause instanceof OpenAIError) {
              yield* this.errorTrackingService.captureError(e);
              return yield* Effect.fail(new AiGeneratorError());
            } else if (Schema.isSchemaError(e)) {
              yield* this.errorTrackingService.captureError(e);
              return yield* Effect.fail(new AiGeneratorError());
            }
            return yield* Effect.fail(e);
          }.bind(this),
        ),
      ),
    );
  }).bind(this);
}
