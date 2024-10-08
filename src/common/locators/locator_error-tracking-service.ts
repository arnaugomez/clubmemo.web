import { ErrorTrackingServiceSentryImpl } from "../data/services/error-tracking-service-sentry-impl";
import type { Dependency } from "../di/locator-types";
import { singleton } from "../di/locator-utils";
import type { ErrorTrackingService } from "../domain/interfaces/error-tracking-service";

export const locator_common_ErrorTrackingService: Dependency<ErrorTrackingService> =
  singleton(() => new ErrorTrackingServiceSentryImpl());
