import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { CookieService } from "@/src/common/domain/interfaces/cookie-service";
import { IpService } from "@/src/common/domain/interfaces/ip-service";
import { ProfilesRepository } from "@/src/profile/domain/interfaces/profiles-repository";
import { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";
import {
  AuthService,
  type LoginWithPasswordInputModel,
} from "../interfaces/auth-service";

/**
 * Logs in the user with their email and password. If the login is successful,
 * it sets a session cookie and sets it in the response.
 *
 * Rate limited to 100 requests/IP-day.
 */
export class LoginWithPasswordUseCase extends Context.Service<LoginWithPasswordUseCase>()(
  "clubmemo/auth/domain/use-cases/login-with-password-use-case",
  {
    make: Effect.gen(function* () {
      const authService = yield* AuthService;
      const ipService = yield* IpService;
      const rateLimitsRepository = yield* RateLimitsRepository;
      const cookieService = yield* CookieService;
      const profilesRepository = yield* ProfilesRepository;
      const execute = Effect.fn("LoginWithPasswordUseCase.execute")(function* (
        input: LoginWithPasswordInputModel,
      ) {
        const ip = yield* ipService.getIp();
        const rateLimitKey = `LoginWithPasswordUseCase/${ip}`;
        yield* rateLimitsRepository.check(rateLimitKey);
        yield* Effect.gen(function* () {
          const { sessionCookie, userId } =
            yield* authService.loginWithPassword(input);

          // If the user was accidentally created without a profile (it can happen in the Admin Panel), create one.
          const profile = yield* profilesRepository.getByUserId(userId);
          if (!profile) {
            yield* profilesRepository.create(userId);
          }

          yield* cookieService.set(sessionCookie);
        }).pipe(
          Effect.catchTag("IncorrectPasswordError", (e) =>
            Effect.gen(function* () {
              yield* rateLimitsRepository.increment(rateLimitKey);
              return yield* Effect.fail(e);
            }),
          ),
        );
      });
      return { execute };
    }),
  },
) {}

export const LoginWithPasswordUseCaseService = LoginWithPasswordUseCase;
