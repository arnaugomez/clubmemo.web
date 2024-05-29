import type { CookieService } from "@/src/common/domain/interfaces/cookie-service";
import type { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";
import { InvalidTokenError, SessionExpiredError } from "../errors/auth-errors";
import type { AuthService } from "../interfaces/auth-service";
import type { EmailVerificationCodesRepository } from "../interfaces/email-verification-codes-repository";
import type { GetSessionUseCase } from "./get-session-use-case";

export class VerifyEmailUseCase {
  constructor(
    private readonly getSessionUseCase: GetSessionUseCase,
    private readonly emailVerificationCodesRepository: EmailVerificationCodesRepository,
    private readonly authService: AuthService,
    private readonly rateLimitsRepository: RateLimitsRepository,
    private readonly cookieService: CookieService,
  ) {}

  async execute(code: string) {
    const { user } = await this.getSessionUseCase.execute();
    if (!user) throw new SessionExpiredError();
    const rateLimitKey = `VerifyEmailUseCase/${user.id}`;

    await this.rateLimitsRepository.check(rateLimitKey);

    const isValid = await this.emailVerificationCodesRepository.verify(
      user.id,
      code,
    );
    if (!isValid) {
      await this.rateLimitsRepository.increment(rateLimitKey);
      throw new InvalidTokenError();
    }

    const sessionCookie = await this.authService.verifyEmail(user.id);
    this.cookieService.set(sessionCookie);
  }
}
