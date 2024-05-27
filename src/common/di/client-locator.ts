import { ErrorTrackingServiceSentryImpl } from "../data/services/error-tracking-service-sentry-impl";
import type { ErrorTrackingService } from "../domain/interfaces/error-tracking-service";
import { singleton } from "./locator";
import type { Dependency } from "./locator-types";

interface ClientLocator {
  ErrorTrackingService: Dependency<ErrorTrackingService>;
}

/**
 * A simple service locator for dependency injection.
 */
export const clientLocator: ClientLocator = {
  ErrorTrackingService: singleton(() => new ErrorTrackingServiceSentryImpl()),
};
