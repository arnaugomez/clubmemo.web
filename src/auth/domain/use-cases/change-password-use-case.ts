import type { Cookie } from "lucia";
import type { AuthService } from "../interfaces/auth-service";

interface ChangePasswordInputModel {
  userId: string;
  password: string;
  newPassword: string;
}

export class ChangePasswordUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(input: ChangePasswordInputModel): Promise<Cookie> {
    await this.authService.checkPasswordIsCorrect({
      userId: input.userId,
      password: input.password,
    });
    await this.authService.updatePassword({
      userId: input.userId,
      password: input.newPassword,
    });
    return await this.authService.resetSessions(input.userId);
  }
}
