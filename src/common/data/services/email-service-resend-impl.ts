import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import { Resend } from "resend";
import { ExternalServiceError } from "@/src/common/effect/errors";
import type { EmailService } from "../../domain/interfaces/email-service";
import type { EnvService } from "../../domain/interfaces/env-service";

/**
 * Implementation of `EmailService` using the Resend SDK
 */
export class EmailServiceResendImpl implements EmailService {
  private readonly resend;
  constructor(private readonly envService: EnvService) {
    this.resend = new Resend(Redacted.value(envService.resendApiKey));
  }
  sendVerificationCode = Effect.fn(
    "EmailServiceResendImpl.sendVerificationCode",
  )(function* (
    this: EmailServiceResendImpl,
    email: string,
    verificationCode: string,
  ) {
    yield* Effect.tryPromise({
      try: () =>
        this.resend.emails.send({
          from: "El equipo de clubmemo <noreply@app.clubmemo.com>",
          to: email,
          subject: "¡Bienvenido a clubmemo! Verifica tu email.",
          html: `<p>Tu código de verificación es <strong>${verificationCode}</strong></p>`,
        }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "EmailServiceResendImpl.sendVerificationCode",
          cause,
        }),
    });
  }).bind(this);

  sendForgotPasswordLink = Effect.fn(
    "EmailServiceResendImpl.sendForgotPasswordLink",
  )(function* (this: EmailServiceResendImpl, email: string, token: string) {
    const url = new URL(this.envService.projectUrl);
    url.pathname = "/auth/reset-password";
    url.search = new URLSearchParams({
      email,
      token,
    }).toString();

    yield* Effect.tryPromise({
      try: () =>
        this.resend.emails.send({
          from: "El equipo de clubmemo <noreply@app.clubmemo.com>",
          to: email,
          subject: "Recupera tu cuenta de clubmemo",
          html: `
      <div>
        <h1>¿Has olvidado tu contraseña?</h1>
        <p>No te preocupes. Recupera tu cuenta haciendo clic en en este <a href="${url}"><strong>enlace de recuperación</strong></a>.</p>
      </div>
      `,
        }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "EmailServiceResendImpl.sendForgotPasswordLink",
          cause,
        }),
    });
  }).bind(this);
}
