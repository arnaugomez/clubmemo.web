/**
 * Repository for rate limits
 *
 * A rate limit is a restriction on the number of actions of a certain kind that
 * can be made on a given day. It is used to prevent abuse of the resources of
 * the system, and protect it to security threats like DoS and DDoS attacks.
 *
 * Rate limits contain
 *
 * - A `name`, the key that uniquely identifies the kind of action that is
 *   performed
 * - A `limit`, the maximum number of actions of that kind that can be performed
 *   today.
 * - The number of actions that have been performed today.
 * - The time when the first action was performed today.
 *
 * If the limit is reached, the action cannot be performed anymore. However,
 * when a day has passed since the first action was performed, the counter is
 * reset to 0. Then, when the counter is set from 0 to 1, the time is updated to
 * the current time.
 */
export interface RateLimitsRepository {
  /**
   * Checks if the action can be performed or the rate limit has been reached If
   * the action can be performed, it does nothing. If the rate limit has been
   * reached, it throws `DailyRateLimitError`.
   *
   * @param name Unique identifier of the action that wants to be performed
   * @param limit The maximum number of actions that can be performed today.
   * Defaults to 100.
   */
  check(name: string, limit?: number): Promise<void>;

  /**
   * Increments the counter of the action that has been performed, to keep track
   * of the number of actions that have been performed today.
   *
   * @param name Unique identifier of the action that has been performed
   */
  increment(name: string): Promise<void>;
}
