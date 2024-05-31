/**
 * Thrown when the AI generator service returns an empty message or a message that does not contain the expected data.
 */
export class AiGeneratorEmptyMessageError extends Error {}
/**
 * Thrown when the AI generator service reaches the rate limit or runs out of credit.
 */
export class AiGeneratorRateLimitError extends Error {}
/**
 * Generic error thrown while generating notes with the external AI service
 */
export class AiGeneratorError extends Error {}
