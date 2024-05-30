import type { EmailService } from "../../domain/interfaces/email-service";
import type { EnvService } from "../../domain/interfaces/env-service";

export class EmailServiceFakeImpl implements EmailService {
  constructor(private readonly envService: EnvService) {}
  async sendVerificationCode(
    email: string,
    verificationCode: string,
  ): Promise<void> {
    // eslint-disable-next-line no-console
    console.table({ email, verificationCode });
  }

  async sendForgotPasswordLink(
    email: string,
    forgotPasswordCode: string,
  ): Promise<void> {
    const url = new URL(this.envService.baseUrl);
    url.pathname = "/auth/reset-password";
    url.search = new URLSearchParams({
      email,
      token: forgotPasswordCode,
    }).toString();
    // eslint-disable-next-line no-console
    console.table({ email, forgotPasswordCode, url: url.toString() });
  }
}
