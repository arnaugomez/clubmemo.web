import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { CookieServiceNextImpl } from "../data/services/cookie-service-next-impl";
import { CookieService } from "../domain/interfaces/cookie-service";

export { CookieService };
export const CookieServiceLive = Layer.effect(
  CookieService,
  Effect.sync(() => {
    return new CookieServiceNextImpl();
  }),
);
