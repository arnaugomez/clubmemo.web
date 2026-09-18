import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { CookieService } from "@/src/common/domain/interfaces/cookie-service";
import { AuthService } from "../interfaces/auth-service";
import { emptyCheckSession } from "../models/check-session-model";

/**
 * Gets the current session of the user from the session cookie. If the
 * session cookie does not exist or if it expired, it returns an empty
 * object.
 */
export class GetSessionUseCase extends Context.Service<GetSessionUseCase>()(
  "clubmemo/auth/domain/use-cases/get-session-use-case",
  {
    make: Effect.gen(function* () {
      const authService = yield* AuthService;
      const cookieService = yield* CookieService;
      const execute = Effect.fn("GetSessionUseCase.execute")(function* () {
        const sessionCookieName = authService.getSessionCookieName();
        const sessionId = yield* cookieService.get(sessionCookieName);
        if (!sessionId) return emptyCheckSession;

        const result = yield* authService.validateSession(sessionId);

        // next.js throws when you attempt to set cookie in Server Components
        yield* Effect.gen(function* () {
          if (result.session?.fresh) {
            const sessionCookie = authService.createSessionCookie(
              result.session.id,
            );
            yield* cookieService.set(sessionCookie);
          }
          if (!result.session) {
            const sessionCookie = authService.createBlankSessionCookie();
            yield* cookieService.set(sessionCookie);
          }
        }).pipe(Effect.ignore);
        return result;
      });
      return { execute };
    }),
  },
) {}

export const GetSessionUseCaseService = GetSessionUseCase;
