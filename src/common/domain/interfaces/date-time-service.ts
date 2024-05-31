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
  getStartOfToday(): Date;
  /**
   * Gets the date at 00:00:00 of tomorrow.
   * @returns The date at 00:00:00 of tomorrow
   */
  getStartOfTomorrow(): Date;
}
