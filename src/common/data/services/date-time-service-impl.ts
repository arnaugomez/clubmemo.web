import { tz } from "@date-fns/tz";
import { addDays, startOfDay } from "date-fns";
import type { DateTimeService } from "../../domain/interfaces/date-time-service";

/**
 * Implementation of `DateTimeService` using the `date-fns` library.
 */
export class DateTimeServiceImpl implements DateTimeService {
  getStartOfToday(): Date {
    return startOfDay(new Date(), { in: tz("Europe/Madrid") });
  }

  getStartOfTomorrow(): Date {
    return addDays(this.getStartOfToday(), 1);
  }
}
