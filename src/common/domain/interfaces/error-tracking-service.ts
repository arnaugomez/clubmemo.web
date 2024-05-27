export interface ErrorTrackingService {
  captureError(error: unknown): void;
}
