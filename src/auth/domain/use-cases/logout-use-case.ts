import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { CookieService } from "@/src/common/domain/interfaces/cookie-service";
import { AuthService } from "../interfaces/auth-service";
import { GetSessionUseCase } from "./get-session-use-case";

/**
 * Logs out the user by invalidating the current session and overwriting the
 * session cookie with a blank session cookie.
 */
export class LogoutUseCase extends Context.Service<LogoutUseCase>()(
  "clubmemo/auth/domain/use-cases/logout-use-case",
  {
    make: Effect.gen(function* () {
      const getSessionUseCase = yield* GetSessionUseCase;
      const authService = yield* AuthService;
      const cookieService = yield* CookieService;
      const execute = Effect.fn("LogoutUseCase.execute")(function* () {
        const { session } = yield* getSessionUseCase.execute();
        if (!session) {
          return;
        }

        yield* authService.invalidateSession(session.id);

        const sessionCookie = authService.createBlankSessionCookie();
        yield* cookieService.set(sessionCookie);
      });
      return { execute };
    }),
  },
) {}

export const LogoutUseCaseService = LogoutUseCase;
