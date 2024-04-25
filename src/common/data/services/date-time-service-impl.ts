import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
import utc from "dayjs/plugin/utc";
import { DateTimeService } from "../../domain/interfaces/date-time-service";

dayjs.extend(utc);
dayjs.extend(timezone);

export class DateTimeServiceImpl implements DateTimeService {
  getStartOfToday(): Date {
    return dayjs().tz("Europe/Madrid").startOf("day").toDate();
  }

  getStartOfTomorrow(): Date {
    return dayjs().tz("Europe/Madrid").add(1, "day").startOf("day").toDate();
  }
}
