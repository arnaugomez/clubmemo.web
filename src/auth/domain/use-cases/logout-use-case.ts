import type { CookieService } from "@/src/common/domain/interfaces/cookie-service";
import type { AuthService } from "../interfaces/auth-service";
import type { GetSessionUseCase } from "./get-session-use-case";

export class LogoutUseCase {
  constructor(
    private readonly getSessionUseCase: GetSessionUseCase,
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

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
