import type { CookieService } from "@/src/common/domain/interfaces/cookie-service";
import type { EmailService } from "@/src/common/domain/interfaces/email-service";
import type { IpService } from "@/src/common/domain/interfaces/ip-service";
import type { ProfilesRepository } from "@/src/profile/domain/interfaces/profiles-repository";
import type { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";
import { UserDoesNotAcceptTermsError } from "../errors/auth-errors";
import type { AuthService } from "../interfaces/auth-service";
import type { EmailVerificationCodesRepository } from "../interfaces/email-verification-codes-repository";

/**
 * Creates a new user account.
 *
 * Creates a new user and a new profile. Sends an email with a verification code
 * to the user's email address. Finally, it sets the session cookie in the server response.
 */
export class SignupUseCase {
  constructor(
    private readonly ipService: IpService,
    private readonly rateLimitsRepository: RateLimitsRepository,
    private readonly authService: AuthService,
    private readonly profilesRepository: ProfilesRepository,
    private readonly emailService: EmailService,
    private readonly emailVerificationCodesRepository: EmailVerificationCodesRepository,
    private readonly cookieService: CookieService,
  ) {}

  /**
   * Creates a new user account.
   *
   * Creates a new user and a new profile. Sends an email with a verification code
   * to the user's email address. Finally, it sets the session cookie in the server response.
   */
  async execute(input: SignupInputModel) {
    if (!input.acceptTerms) throw new UserDoesNotAcceptTermsError();

    const ip = await this.ipService.getIp();
    const rateLimitKey = `SignupUseCase/${ip}`;

    await this.rateLimitsRepository.check(rateLimitKey, 40);

    const { userId, sessionCookie } =
      await this.authService.signupWithPassword(input);

    await this.profilesRepository.create(userId);

    const { code } =
      await this.emailVerificationCodesRepository.generate(userId);

    await this.emailService.sendVerificationCode(input.email, code);

    await this.rateLimitsRepository.increment(rateLimitKey);

    this.cookieService.set(sessionCookie);
  }
}

interface SignupInputModel {
  email: string;
  password: string;
  acceptTerms: boolean;
}
