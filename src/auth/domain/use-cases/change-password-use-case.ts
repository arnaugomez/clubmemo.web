import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { CookieService } from "@/src/common/domain/interfaces/cookie-service";
import { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";
import { UserDoesNotExistError } from "../errors/auth-errors";
import { AuthService } from "../interfaces/auth-service";
import { GetSessionUseCase } from "./get-session-use-case";

interface ChangePasswordInputModel {
  password: string;
  newPassword: string;
}

/**
 * Changes the password of the user
 *
 * Before changing the password, it checks if the current password is correct.
 * If it is not, it throws `IncorrectPasswordError`.
 *
 * Then, it invalidates all user sessions (so that other devices cannot log
 * in) and sets a new session cookie.
 *
 * @param input The user and the new password
 */
export class ChangePasswordUseCase extends Context.Service<ChangePasswordUseCase>()(
  "clubmemo/auth/domain/use-cases/change-password-use-case",
  {
    make: Effect.gen(function* () {
      const getSessionUseCase = yield* GetSessionUseCase;
      const authService = yield* AuthService;
      const rateLimitsRepository = yield* RateLimitsRepository;
      const cookieService = yield* CookieService;
      const execute = Effect.fn("ChangePasswordUseCase.execute")(function* (
        input: ChangePasswordInputModel,
      ) {
        const { user } = yield* getSessionUseCase.execute();
        if (!user) return yield* Effect.fail(new UserDoesNotExistError());
        const userId = user.id;

        const rateLimitKey = `ChangePasswordUseCase/${userId}`;
        yield* rateLimitsRepository.check(rateLimitKey);

        yield* Effect.gen(function* () {
          yield* authService.checkPasswordIsCorrect({
            userId,
            password: input.password,
          });
        }).pipe(
          Effect.catchTag("IncorrectPasswordError", (e) =>
            Effect.gen(function* () {
              yield* rateLimitsRepository.increment(rateLimitKey);
              return yield* Effect.fail(e);
            }),
          ),
        );
        yield* authService.updatePassword({
          userId,
          password: input.newPassword,
        });

        const cookie = yield* authService.resetSessions(userId);
        yield* cookieService.set(cookie);
      });
      return { execute };
    }),
  },
) {}

export const ChangePasswordUseCaseService = ChangePasswordUseCase;
