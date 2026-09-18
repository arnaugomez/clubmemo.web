import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { CookieService } from "@/src/common/domain/interfaces/cookie-service";
import { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";
import { InvalidTokenError, SessionExpiredError } from "../errors/auth-errors";
import { AuthService } from "../interfaces/auth-service";
import { EmailVerificationCodesRepository } from "../interfaces/email-verification-codes-repository";
import { GetSessionUseCase } from "./get-session-use-case";

/**
 * Sets the user's email as verified.
 *
 * Once the user's email is verified, the user can perform actions that require
 * email verification, such as access to most of the pages of the website.
 *
 * First, it checks if the email verification code is valid. If it is not, it
 * throws `InvalidTokenError`. Then, it sets the user's email as verified and
 * sets a new session cookie.
 *
 * Rate limited to 100 requests/user-day.
 */
export class VerifyEmailUseCase extends Context.Service<VerifyEmailUseCase>()(
  "clubmemo/auth/domain/use-cases/verify-email-use-case",
  {
    make: Effect.gen(function* () {
      const getSessionUseCase = yield* GetSessionUseCase;
      const emailVerificationCodesRepository =
        yield* EmailVerificationCodesRepository;
      const authService = yield* AuthService;
      const rateLimitsRepository = yield* RateLimitsRepository;
      const cookieService = yield* CookieService;
      const execute = Effect.fn("VerifyEmailUseCase.execute")(function* (
        code: string,
      ) {
        const { user } = yield* getSessionUseCase.execute();
        if (!user) return yield* Effect.fail(new SessionExpiredError());
        const rateLimitKey = `VerifyEmailUseCase/${user.id}`;

        yield* rateLimitsRepository.check(rateLimitKey);

        const isValid = yield* emailVerificationCodesRepository.verify(
          user.id,
          code,
        );
        if (!isValid) {
          yield* rateLimitsRepository.increment(rateLimitKey);
          return yield* Effect.fail(new InvalidTokenError());
        }

        const sessionCookie = yield* authService.verifyEmail(user.id);
        yield* cookieService.set(sessionCookie);
      });
      return { execute };
    }),
  },
) {}

export const VerifyEmailUseCaseService = VerifyEmailUseCase;
