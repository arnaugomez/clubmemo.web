import type { IpService } from "@/src/common/domain/interfaces/ip-service";
import type { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";
import { cookies } from "next/headers";
import { IncorrectPasswordError } from "../errors/auth-errors";
import type {
  AuthService,
  LoginWithPasswordInputModel,
} from "../interfaces/auth-service";

export class LoginWithPasswordUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly ipService: IpService,
    private readonly rateLimitsRepository: RateLimitsRepository,
  ) {}

  async execute(input: LoginWithPasswordInputModel): Promise<void> {
    const ip = await this.ipService.getIp();
    const rateLimitKey = `LoginWithPasswordUseCase/${ip}`;
    await this.rateLimitsRepository.check(rateLimitKey);
    try {
      const sessionCookie = await this.authService.loginWithPassword(input);

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    } catch (e) {
      if (e instanceof IncorrectPasswordError) {
        await this.rateLimitsRepository.increment(rateLimitKey);
      }
      throw e;
    }
  }
}
