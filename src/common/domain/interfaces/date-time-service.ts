import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
/**
 * Represents a service that provides complex date and time related operations.
 *
 * Regardless of the execution runtime of the app and its geographical location,
 * the dates are calculated in the "Europe/Madrid" timezone. This provides
 * consistency and predictability to the date and time operations.
 */
export interface DateTimeService {
  /**
   * Gets the date at 00:00:00 of today.
   *
   * @returns The date at 00:00:00 of today
   */
  getStartOfToday(): Effect.Effect<Date>;
  /**
   * Gets the date at 00:00:00 of tomorrow.
   * @returns The date at 00:00:00 of tomorrow
   */
  getStartOfTomorrow(): Effect.Effect<Date>;
}

export const DateTimeService = Context.Service<DateTimeService>(
  "clubmemo/common/domain/interfaces/date-time-service/DateTimeService",
);
