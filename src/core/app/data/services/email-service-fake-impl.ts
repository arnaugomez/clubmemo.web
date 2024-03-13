import { EmailService } from "../../domain/interfaces/email-service";

export class EmailServiceFakeImpl implements EmailService {
  constructor() {}
  async sendVerificationCode(
    email: string,
    verificationCode: string,
  ): Promise<void> {
    console.table({ email, verificationCode });
  }

  async sendForgotPasswordCode(
    email: string,
    forgotPasswordCode: string,
  ): Promise<void> {
    console.table({ email, forgotPasswordCode });
  }
}
