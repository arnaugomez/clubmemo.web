import type { CookieService } from "@/src/common/domain/interfaces/cookie-service";
import type { AuthService } from "../interfaces/auth-service";
import type { GetSessionUseCase } from "./get-session-use-case";

/**
 * Logs out the user by invalidating the current session and overwriting the
 * session cookie with a blank session cookie.
 */
export class LogoutUseCase {
  constructor(
    private readonly getSessionUseCase: GetSessionUseCase,
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  /**
   * Logs out the user by invalidating the current session and overwriting the
   * session cookie with a blank session cookie.
   */
  async execute() {
    const { session } = await this.getSessionUseCase.execute();
    if (!session) {
      return;
    }

    await this.authService.invalidateSession(session.id);

    const sessionCookie = this.authService.createBlankSessionCookie();
    this.cookieService.set(sessionCookie);
  }
}
