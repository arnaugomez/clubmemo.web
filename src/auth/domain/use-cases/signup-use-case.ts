import type { CookieService } from "@/src/common/domain/interfaces/cookie-service";
import type { EmailService } from "@/src/common/domain/interfaces/email-service";
import type { IpService } from "@/src/common/domain/interfaces/ip-service";
import type { ProfilesRepository } from "@/src/profile/domain/interfaces/profiles-repository";
import type { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";
import type { AuthService } from "../interfaces/auth-service";
import type { EmailVerificationCodesRepository } from "../interfaces/email-verification-codes-repository";

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

  async execute(input: SignupInputModel) {
    const ip = await this.ipService.getIp();
    const rateLimitKey = `signupAction/${ip}`;

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
}
