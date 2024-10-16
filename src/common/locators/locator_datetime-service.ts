import { DateTimeServiceImpl } from "../data/services/date-time-service-impl";
import type { Dependency } from "../di/locator-types";
import { singleton } from "../di/locator-utils";
import type { DateTimeService } from "../domain/interfaces/date-time-service";

export const locator_common_DateTimeService: Dependency<DateTimeService> =
  singleton(() => new DateTimeServiceImpl());
