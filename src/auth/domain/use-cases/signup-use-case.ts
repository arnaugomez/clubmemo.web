import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { CookieService } from "@/src/common/domain/interfaces/cookie-service";
import { EmailService } from "@/src/common/domain/interfaces/email-service";
import { IpService } from "@/src/common/domain/interfaces/ip-service";
import { ProfilesRepository } from "@/src/profile/domain/interfaces/profiles-repository";
import { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";
import { UserDoesNotAcceptTermsError } from "../errors/auth-errors";
import { AuthService } from "../interfaces/auth-service";
import { EmailVerificationCodesRepository } from "../interfaces/email-verification-codes-repository";

/**
 * Creates a new user account.
 *
 * Creates a new user and a new profile. Sends an email with a verification code
 * to the user's email address. Finally, it sets the session cookie in the server response.
 */
export class SignupUseCase extends Context.Service<SignupUseCase>()(
  "clubmemo/auth/domain/use-cases/signup-use-case",
  {
    make: Effect.gen(function* () {
      const ipService = yield* IpService;
      const rateLimitsRepository = yield* RateLimitsRepository;
      const authService = yield* AuthService;
      const profilesRepository = yield* ProfilesRepository;
      const emailVerificationCodesRepository =
        yield* EmailVerificationCodesRepository;
      const emailService = yield* EmailService;
      const cookieService = yield* CookieService;
      const execute = Effect.fn("SignupUseCase.execute")(function* (
        input: SignupInputModel,
      ) {
        if (!input.acceptTerms)
          return yield* Effect.fail(new UserDoesNotAcceptTermsError());

        const ip = yield* ipService.getIp();
        const rateLimitKey = `SignupUseCase/${ip}`;

        yield* rateLimitsRepository.check(rateLimitKey, 40);

        const { userId, sessionCookie } =
          yield* authService.signupWithPassword(input);

        yield* profilesRepository.create(userId);

        const emailVerificationCode =
          yield* emailVerificationCodesRepository.generate(userId);
        const code = emailVerificationCode.code;

        yield* emailService.sendVerificationCode(input.email, code);

        yield* rateLimitsRepository.increment(rateLimitKey);

        yield* cookieService.set(sessionCookie);
      });
      return { execute };
    }),
  },
) {}

interface SignupInputModel {
  email: string;
  password: string;
  acceptTerms: boolean;
}

export const SignupUseCaseService = SignupUseCase;
