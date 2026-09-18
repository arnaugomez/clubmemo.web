import * as Effect from "effect/Effect";
import type { EmailService } from "../../domain/interfaces/email-service";
import type { EnvService } from "../../domain/interfaces/env-service";

/**
 * Implementation of `EmailService` that does not send emails and logs the email
 * data to the console instead. Used for local development, debugging and
 * testing. Not suitable for production.
 */
export class EmailServiceFakeImpl implements EmailService {
  constructor(private readonly envService: EnvService) {}
  sendVerificationCode = Effect.fn("EmailServiceFakeImpl.sendVerificationCode")(
    function (
      this: EmailServiceFakeImpl,
      _email: string,
      _verificationCode: string,
    ): Effect.Effect<void> {
      return Effect.sync(() => {});
    },
  ).bind(this);

  sendForgotPasswordLink = Effect.fn(
    "EmailServiceFakeImpl.sendForgotPasswordLink",
  )(function (
    this: EmailServiceFakeImpl,
    email: string,
    forgotPasswordCode: string,
  ): Effect.Effect<void> {
    return Effect.sync(() => {
      const url = new URL(this.envService.projectUrl);
      url.pathname = "/auth/reset-password";
      url.search = new URLSearchParams({
        email,
        token: forgotPasswordCode,
      }).toString();
    });
  }).bind(this);
}
