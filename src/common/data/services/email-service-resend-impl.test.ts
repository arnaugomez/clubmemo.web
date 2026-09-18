import * as Effect from "effect/Effect";
import { Resend } from "resend";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EmailServiceResendImpl } from "./email-service-resend-impl";
import { applicationConfig } from "./env-service-impl";

vi.mock("resend", () => {
  const sendMock = vi
    .fn()
    .mockResolvedValue({ data: { id: "test" }, error: null });
  class ResendMock {
    emails = {
      send: sendMock,
    };
  }
  return { Resend: ResendMock };
});

describe("EmailServiceResendImpl", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("sendVerificationCode sends an email with a verfication code", async () => {
    const email = "test@example.com";
    const verificationCode = "123456";

    const envService = Effect.runSync(applicationConfig);

    const emailService = new EmailServiceResendImpl(envService);
    await Effect.runPromise(
      emailService.sendVerificationCode(email, verificationCode),
    );

    expect(new Resend().emails.send).toHaveBeenCalledWith({
      from: "El equipo de clubmemo <noreply@app.clubmemo.com>",
      to: email,
      subject: "¡Bienvenido a clubmemo! Verifica tu email.",
      html: expect.stringContaining(verificationCode),
    });
  });

  it("sendForgotPasswordLink a forgot password email", async () => {
    const email = "test@example.com";
    const token = "reset-token";

    const envService = Effect.runSync(applicationConfig);
    const emailService = new EmailServiceResendImpl(envService);
    await Effect.runPromise(emailService.sendForgotPasswordLink(email, token));

    const expectedUrl =
      "https://www.clubmemo.com/auth/reset-password?email=test%40example.com&token=reset-token";

    expect(new Resend().emails.send).toHaveBeenCalledWith({
      from: "El equipo de clubmemo <noreply@app.clubmemo.com>",
      to: email,
      subject: "Recupera tu cuenta de clubmemo",
      html: expect.stringContaining(`href="${expectedUrl}"`),
    });
  });
});
