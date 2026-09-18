import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { DateTimeServiceImpl } from "../data/services/date-time-service-impl";
import { DateTimeService } from "../domain/interfaces/date-time-service";

export { DateTimeService };
export const DateTimeServiceLive = Layer.effect(
  DateTimeService,
  Effect.sync(() => {
    return new DateTimeServiceImpl();
  }),
);
