import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { EmailService } from "@/src/common/domain/interfaces/email-service";
import { IpService } from "@/src/common/domain/interfaces/ip-service";
import { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";
import { UserDoesNotExistError } from "../errors/auth-errors";
import { ForgotPasswordTokensRepository } from "../interfaces/forgot-password-tokens-repository";
import { UsersRepository } from "../interfaces/users-repository";

/**
 * Sends a reset password email to the user.
 *
 * If a user with the `email` param does not exist, it throws
 * `UserDoesNotExistError`.
 *
 * @input email The email of the user.
 */
export class ForgotPasswordUseCase extends Context.Service<ForgotPasswordUseCase>()(
  "clubmemo/auth/domain/use-cases/forgot-password-use-case",
  {
    make: Effect.gen(function* () {
      const ipService = yield* IpService;
      const rateLimitsRepository = yield* RateLimitsRepository;
      const usersRepository = yield* UsersRepository;
      const forgotPasswordTokensRepository =
        yield* ForgotPasswordTokensRepository;
      const emailService = yield* EmailService;
      const execute = Effect.fn("ForgotPasswordUseCase.execute")(function* (
        email: string,
      ) {
        const ip = yield* ipService.getIp();
        const rateLimitKey = `ForgotPasswordUseCase/${ip}`;

        yield* rateLimitsRepository.check(rateLimitKey, 40);

        const user = yield* usersRepository.getByEmail(email);
        if (!user) return yield* Effect.fail(new UserDoesNotExistError());

        const token = yield* forgotPasswordTokensRepository.generate(user.id);

        yield* emailService.sendForgotPasswordLink(user.email, token);

        yield* rateLimitsRepository.increment(rateLimitKey);
      });
      return { execute };
    }),
  },
) {}

export const ForgotPasswordUseCaseService = ForgotPasswordUseCase;
