import type { IpService } from "@/src/common/domain/interfaces/ip-service";
import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import type { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";
import {
  ForgotPasswordCodeExpiredError,
  UserDoesNotExistError,
} from "../errors/auth-errors";
import type { AuthService } from "../interfaces/auth-service";
import type { ForgotPasswordTokensRepository } from "../interfaces/forgot-password-tokens-repository";
import type { UsersRepository } from "../interfaces/users-repository";

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
export class ResetPasswordUseCase {
  constructor(
    private readonly ipService: IpService,
    private readonly rateLimitsRepository: RateLimitsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
    private readonly forgotPasswordTokensRepository: ForgotPasswordTokensRepository,
  ) {}

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
  async execute(input: ResetPasswordInputModel) {
    const ip = await this.ipService.getIp();
    const rateLimitKey = `ResetPasswordUseCase/${ip}`;

    await this.rateLimitsRepository.check(rateLimitKey);

    const user = await this.usersRepository.getByEmail(input.email);
    if (!user) {
      throw new UserDoesNotExistError();
    }

    const isValid = await this.forgotPasswordTokensRepository.validate(
      user.id,
      input.token,
    );
    if (!isValid) {
      await this.rateLimitsRepository.increment(rateLimitKey);
      throw new NoPermissionError();
    }

    const forgotPasswordCode = await this.forgotPasswordTokensRepository.get(
      user.id,
    );
    if (!forgotPasswordCode || forgotPasswordCode.hasExpired) {
      throw new ForgotPasswordCodeExpiredError();
    }

    await this.authService.updatePassword({
      userId: user.id,
      password: input.password,
    });

    await this.forgotPasswordTokensRepository.delete(user.id);

    await this.authService.invalidateUserSessions(user.id);
  }
}

interface ResetPasswordInputModel {
  email: string;
  token: string;
  password: string;
}
