import * as Schema from "effect/Schema";
/**
 * Thrown when the AI generator service returns an empty message or a message that does not contain the expected data.
 */
export class AiGeneratorEmptyMessageError extends Schema.TaggedError<AiGeneratorEmptyMessageError>()(
  "AiGeneratorEmptyMessageError",
  {},
) {}
/**
 * Thrown when the AI generator service reaches the rate limit or runs out of credit.
 */
export class AiGeneratorRateLimitError extends Schema.TaggedError<AiGeneratorRateLimitError>()(
  "AiGeneratorRateLimitError",
  {},
) {}
/**
 * Generic error thrown while generating notes with the external AI service
 */
export class AiGeneratorError extends Schema.TaggedError<AiGeneratorError>()(
  "AiGeneratorError",
  {},
) {}
