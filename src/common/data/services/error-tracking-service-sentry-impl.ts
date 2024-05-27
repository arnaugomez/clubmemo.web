import { captureException } from "@sentry/nextjs";
import type { ErrorTrackingService } from "../../domain/interfaces/error-tracking-service";

export class ErrorTrackingServiceSentryImpl implements ErrorTrackingService {
  captureError(error: unknown): void {
    console.error(error);
    captureException(error);
  }
}
