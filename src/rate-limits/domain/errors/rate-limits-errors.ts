import * as Schema from "effect/Schema";

export class DailyRateLimitError extends Schema.TaggedError<DailyRateLimitError>()(
  "DailyRateLimitError",
  { limit: Schema.Number },
) {
  constructor(limit: number) {
    super({ limit });
  }
  override get message() {
    return `Daily rate limit exceeded: ${this.limit}`;
  }
}
