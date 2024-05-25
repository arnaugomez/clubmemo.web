import type { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";
import type { Cookie } from "lucia";
import { IncorrectPasswordError } from "../errors/auth-errors";
import type { AuthService } from "../interfaces/auth-service";

interface ChangePasswordInputModel {
  userId: string;
  password: string;
  newPassword: string;
}

export class ChangePasswordUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly rateLimitsRepository: RateLimitsRepository,
  ) {}

  async execute(input: ChangePasswordInputModel): Promise<Cookie> {
    const rateLimitKey = `ChangePasswordUseCase/${input.userId}`;
    await this.rateLimitsRepository.check(rateLimitKey);

    try {
      await this.authService.checkPasswordIsCorrect({
        userId: input.userId,
        password: input.password,
      });
    } catch (e) {
      if (e instanceof IncorrectPasswordError) {
        await this.rateLimitsRepository.increment(rateLimitKey);
      }
      throw e;
    }
    await this.authService.updatePassword({
      userId: input.userId,
      password: input.newPassword,
    });
    return await this.authService.resetSessions(input.userId);
  }
}
