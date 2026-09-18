import * as Effect from "effect/Effect";
import { cookies } from "next/headers";
import { ExternalServiceError } from "@/src/common/effect/errors";
import type {
  CookieService,
  SetCookieInputModel,
} from "../../domain/interfaces/cookie-service";

/**
 * Implementation of `CookieService` using the Next `cookies` function.
 */
export class CookieServiceNextImpl implements CookieService {
  get = Effect.fn("CookieServiceNextImpl.get")(function* (
    this: CookieServiceNextImpl,
    name: string,
  ) {
    const cookieStore = yield* Effect.tryPromise({
      try: () => cookies(),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "CookieServiceNextImpl.get",
          cause,
        }),
    });
    return cookieStore.get(name)?.value;
  }).bind(this);
  set = Effect.fn("CookieServiceNextImpl.set")(function* (
    this: CookieServiceNextImpl,
    input: SetCookieInputModel,
  ) {
    const cookieStore = yield* Effect.tryPromise({
      try: () => cookies(),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "CookieServiceNextImpl.set",
          cause,
        }),
    });
    yield* Effect.try({
      try: () => cookieStore.set(input.name, input.value, input.attributes),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "CookieServiceNextImpl.set",
          cause,
        }),
    });
  }).bind(this);
}
