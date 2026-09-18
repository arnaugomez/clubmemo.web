import * as Context from "effect/Context";
import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
import { IpService } from "@/src/common/domain/interfaces/ip-service";
import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";
import {
  ForgotPasswordCodeExpiredError,
  UserDoesNotExistError,
} from "../errors/auth-errors";
import { AuthService } from "../interfaces/auth-service";
import { ForgotPasswordTokensRepository } from "../interfaces/forgot-password-tokens-repository";
import { UsersRepository } from "../interfaces/users-repository";

/**
 * Sets a new password for the user.
 *
 * Before setting the new password, it checks if the user exists and if the
 * forgot password token is valid.
 * - If the user does not exist, it throws `UserDoesNotExistError`.
 * - If the token is invalid, it throws `NoPermissionError`.
 * - If the token has expired, it throws `ForgotPasswordCodeExpiredError`.
 *
 * If everything is correct, it sets the new password and invalidates all other
 * user sessions for security reasons.
 */
export class ResetPasswordUseCase extends Context.Service<ResetPasswordUseCase>()(
  "clubmemo/auth/domain/use-cases/reset-password-use-case",
  {
    make: Effect.gen(function* () {
      const ipService = yield* IpService;
      const rateLimitsRepository = yield* RateLimitsRepository;
      const usersRepository = yield* UsersRepository;
      const authService = yield* AuthService;
      const forgotPasswordTokensRepository =
        yield* ForgotPasswordTokensRepository;
      const execute = Effect.fn("ResetPasswordUseCase.execute")(function* (
        input: ResetPasswordInputModel,
      ) {
        const ip = yield* ipService.getIp();
        const rateLimitKey = `ResetPasswordUseCase/${ip}`;

        yield* rateLimitsRepository.check(rateLimitKey);

        const user = yield* usersRepository.getByEmail(input.email);
        if (!user) {
          return yield* Effect.fail(new UserDoesNotExistError());
        }

        const isValid = yield* forgotPasswordTokensRepository.validate(
          user.id,
          input.token,
        );
        if (!isValid) {
          yield* rateLimitsRepository.increment(rateLimitKey);
          return yield* Effect.fail(new NoPermissionError());
        }

        const forgotPasswordCode = yield* forgotPasswordTokensRepository.get(
          user.id,
        );
        if (
          !forgotPasswordCode ||
          forgotPasswordCode.data.expiresAt.getTime() <=
            DateTime.toEpochMillis(yield* DateTime.now)
        ) {
          return yield* Effect.fail(new ForgotPasswordCodeExpiredError());
        }

        yield* authService.updatePassword({
          userId: user.id,
          password: input.password,
        });

        yield* forgotPasswordTokensRepository.delete(user.id);

        yield* authService.invalidateUserSessions(user.id);
      });
      return { execute };
    }),
  },
) {}

interface ResetPasswordInputModel {
  email: string;
  token: string;
  password: string;
}

export const ResetPasswordUseCaseService = ResetPasswordUseCase;
