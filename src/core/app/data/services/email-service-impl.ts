import { Resend } from "resend";
import { EmailService } from "../../domain/interfaces/email-service";

export class EmailServiceImpl implements EmailService {
  private readonly resend;
  constructor() {
    this.resend = new Resend(process.env.SENDGRID_API_KEY);
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
