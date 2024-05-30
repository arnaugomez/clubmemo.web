export class DailyRateLimitError extends Error {
  public limit: number;
  constructor(limit: number) {
    super(`Daily rate limit exceeded: ${limit}`);
    this.limit = limit;
  }
}
