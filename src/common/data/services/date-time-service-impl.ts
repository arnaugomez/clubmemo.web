import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
import type { DateTimeService } from "../../domain/interfaces/date-time-service";

/** Calendar boundaries use the application timezone and Effect's testable Clock. */
export class DateTimeServiceImpl implements DateTimeService {
  getStartOfToday = Effect.fn("DateTime.startOfToday")(function* () {
    const now = DateTime.setZoneNamedUnsafe(
      yield* DateTime.now,
      "Europe/Madrid",
    );
    return DateTime.toDateUtc(DateTime.startOf(now, "day"));
  });

  getStartOfTomorrow = Effect.fn("DateTime.startOfTomorrow")(function* () {
    const now = DateTime.setZoneNamedUnsafe(
      yield* DateTime.now,
      "Europe/Madrid",
    );
    return DateTime.toDateUtc(
      DateTime.add(DateTime.startOf(now, "day"), { days: 1 }),
    );
  });
}
