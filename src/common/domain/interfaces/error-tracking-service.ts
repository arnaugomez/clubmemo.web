/**
 * Keeps track of errors that occur in the application and sends them to an
 * external service for further analysis.
 */
export interface ErrorTrackingService {
  /**
   * Captures an error to send it to an external persistence service
   * for further analysis.
   *
   * @param error The error to capture. It can be a value of any type.
   */
  captureError(error: unknown): void;
}
