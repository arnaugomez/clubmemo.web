export interface RateLimitsRepository {
  check(name: string, limit?: number): Promise<void>;
  increment(name: string): Promise<void>;
}
