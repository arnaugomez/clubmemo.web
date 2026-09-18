import { captureException } from "@sentry/nextjs";
import * as Effect from "effect/Effect";
import type { ErrorTrackingService } from "../../domain/interfaces/error-tracking-service";

/**
 * Implementation of `ErrorTrackingService` using Sentry.
 */
export class ErrorTrackingServiceSentryImpl implements ErrorTrackingService {
  captureError = (error: unknown): Effect.Effect<void> =>
    Effect.sync(() => {
      console.error(error);
      captureException(error);
    });
}
