import { Cookie } from "lucia";
import { AuthService } from "../interfaces/auth-service";

interface ChangePasswordInputModel {
  userId: string;
  password: string;
}

export class ChangePasswordUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(input: ChangePasswordInputModel): Promise<Cookie> {
    await this.authService.updatePassword({
      userId: input.userId,
      password: input.password,
    });
    return await this.authService.resetSessions(input.userId);
  }
}
