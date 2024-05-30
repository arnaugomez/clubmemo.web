import type { EmailService } from "@/src/common/domain/interfaces/email-service";
import type { IpService } from "@/src/common/domain/interfaces/ip-service";
import type { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";
import { UserDoesNotExistError } from "../errors/auth-errors";
import type { ForgotPasswordTokensRepository } from "../interfaces/forgot-password-tokens-repository";
import type { UsersRepository } from "../interfaces/users-repository";

export class ForgotPasswordUseCase {
  constructor(
    private readonly ipService: IpService,
    private readonly rateLimitsRepository: RateLimitsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly forgotPasswordTokensRepository: ForgotPasswordTokensRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(email: string) {
    const ip = await this.ipService.getIp();
    const rateLimitKey = `ForgotPasswordUseCase/${ip}`;

    await this.rateLimitsRepository.check(rateLimitKey, 40);

    const user = await this.usersRepository.getByEmail(email);
    if (!user) throw new UserDoesNotExistError();

    const token = await this.forgotPasswordTokensRepository.generate(user.id);

    await this.emailService.sendForgotPasswordLink(user.email, token);

    await this.rateLimitsRepository.increment(rateLimitKey);
  }
}
