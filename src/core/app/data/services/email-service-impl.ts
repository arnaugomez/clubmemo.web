import { Resend } from "resend";
import { EmailService } from "../../domain/interfaces/email-service";
import { EnvService } from "../../domain/interfaces/env-service";

export class EmailServiceImpl implements EmailService {
  private readonly resend;
  constructor(private readonly envService: EnvService) {
    this.resend = new Resend(envService.resendApiKey);
  }
  async sendVerificationCode(
    email: string,
    verificationCode: string,
  ): Promise<void> {
    if (process.env.SEND_EMAIL !== "true") {
      console.table({ email, verificationCode });
      return;
    }

    await this.resend.emails.send({
      from: "El equipo de clubmemo <noreply@app.clubmemo.com>",
      to: email,
      subject: "¡Bienvenido a clubmemo! Verifica tu email.",
      html: `<p>Tu código de verificación es <strong>${verificationCode}</strong></p>`,
    });
  }
}
