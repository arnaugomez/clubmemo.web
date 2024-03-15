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
    await this.resend.emails.send({
      from: "El equipo de clubmemo <noreply@app.clubmemo.com>",
      to: email,
      subject: "¡Bienvenido a clubmemo! Verifica tu email.",
      html: `<p>Tu código de verificación es <strong>${verificationCode}</strong></p>`,
    });
  }

  async sendForgotPasswordLink(email: string, token: string): Promise<void> {
    const url = new URL(this.envService.baseUrl);
    url.pathname = "/auth/reset-password";
    url.search = new URLSearchParams({
      email,
      token,
    }).toString();

    await this.resend.emails.send({
      from: "El equipo de clubmemo <noreply@app.clubmemo.com>",
      to: email,
      subject: "Recupera tu cuenta de clubmemo",
      html: `
      <div>
        <h1>¿Has olvidado tu contraseña?</h1>
        <p>No te preocupes. Recupera tu cuenta haciendo clic en en este <a href="${url}"><strong>enlace de recuperación</strong></a>.</p> 
      </div>
      `,
    });
  }
}
