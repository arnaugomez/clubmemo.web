import type { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";
import type { Cookie } from "lucia";
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

export class ChangePasswordUseCase {
  constructor(
    private readonly getSessionUseCase: GetSessionUseCase,
    private readonly authService: AuthService,
    private readonly rateLimitsRepository: RateLimitsRepository,
  ) {}

  async execute(input: ChangePasswordInputModel): Promise<Cookie> {
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
    return await this.authService.resetSessions(userId);
  }
}
