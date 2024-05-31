import type { CookieService } from "@/src/common/domain/interfaces/cookie-service";
import type { IpService } from "@/src/common/domain/interfaces/ip-service";
import type { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";
import { IncorrectPasswordError } from "../errors/auth-errors";
import type {
  AuthService,
  LoginWithPasswordInputModel,
} from "../interfaces/auth-service";

/**
 * Logs in the user with their email and password. If the login is successful,
 * it sets a session cookie and sets it in the response.
 *
 * Rate limited to 100 requests/IP-day.
 */
export class LoginWithPasswordUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly ipService: IpService,
    private readonly rateLimitsRepository: RateLimitsRepository,
    private readonly cookieService: CookieService,
  ) {}

  /**
   * Logs in the user with their email and password. If the login is successful,
   * it sets a session cookie and sets it in the response.
   *
   * Rate limited to 100 requests/IP-day.
   */
  async execute(input: LoginWithPasswordInputModel): Promise<void> {
    const ip = await this.ipService.getIp();
    const rateLimitKey = `LoginWithPasswordUseCase/${ip}`;
    await this.rateLimitsRepository.check(rateLimitKey);
    try {
      const sessionCookie = await this.authService.loginWithPassword(input);

      this.cookieService.set(sessionCookie);
    } catch (e) {
      if (e instanceof IncorrectPasswordError) {
        await this.rateLimitsRepository.increment(rateLimitKey);
      }
      throw e;
    }
  }
}
