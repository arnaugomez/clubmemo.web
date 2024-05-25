export interface RateLimitsRepository {
  getHasReachedLimit(name: string, limit?: number): Promise<boolean>;
  increment(name: string): Promise<void>;
}
