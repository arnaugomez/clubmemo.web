import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { ErrorTrackingServiceSentryImpl } from "../data/services/error-tracking-service-sentry-impl";
import { ErrorTrackingService } from "../domain/interfaces/error-tracking-service";

export { ErrorTrackingService };
export const ErrorTrackingServiceLive = Layer.effect(
  ErrorTrackingService,
  Effect.sync(() => {
    return new ErrorTrackingServiceSentryImpl();
  }),
);
