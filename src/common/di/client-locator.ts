import { ErrorTrackingServiceSentryImpl } from "../data/services/error-tracking-service-sentry-impl";
import type { ErrorTrackingService } from "../domain/interfaces/error-tracking-service";
import type { Dependency } from "./locator-types";
import { singleton } from "./locator-utils";

interface ClientLocator {
  ErrorTrackingService: Dependency<ErrorTrackingService>;
}

/**
 * A simple service locator for dependency injection with the dependencies that are
 * used both in the client and server side of the application.
 *
 * The other service locators contain dependencies that are only used in the server.
 */
export const clientLocator: ClientLocator = {
  ErrorTrackingService: singleton(() => new ErrorTrackingServiceSentryImpl()),
};
