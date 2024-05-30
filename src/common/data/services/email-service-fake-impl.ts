import type { EmailService } from "../../domain/interfaces/email-service";

export class EmailServiceFakeImpl implements EmailService {
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
    // eslint-disable-next-line no-console
    console.table({ email, forgotPasswordCode });
  }
}
