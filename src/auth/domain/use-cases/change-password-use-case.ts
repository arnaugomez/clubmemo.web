import type { CookieService } from "@/src/common/domain/interfaces/cookie-service";
import type { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";
import {
  IncorrectPasswordError,
  UserDoesNotExistError,
} from "../errors/auth-errors";
import type { AuthService } from "../interfaces/auth-service";
import type { GetSessionUseCase } from "./get-session-use-case";

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
export class ChangePasswordUseCase {
  constructor(
    private readonly getSessionUseCase: GetSessionUseCase,
    private readonly authService: AuthService,
    private readonly rateLimitsRepository: RateLimitsRepository,
    private readonly cookieService: CookieService,
  ) {}

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
  async execute(input: ChangePasswordInputModel): Promise<void> {
    const { user } = await this.getSessionUseCase.execute();
    if (!user) throw new UserDoesNotExistError();
    const userId = user.id;

    const rateLimitKey = `ChangePasswordUseCase/${userId}`;
    await this.rateLimitsRepository.check(rateLimitKey);

    try {
      await this.authService.checkPasswordIsCorrect({
        userId,
        password: input.password,
      });
    } catch (e) {
      if (e instanceof IncorrectPasswordError) {
        await this.rateLimitsRepository.increment(rateLimitKey);
      }
      throw e;
    }
    await this.authService.updatePassword({
      userId,
      password: input.newPassword,
    });

    const cookie = await this.authService.resetSessions(userId);
    this.cookieService.set(cookie);
  }
}
