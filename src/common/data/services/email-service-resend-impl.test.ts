import { afterEach } from "node:test";
import { Resend } from "resend";
import { describe, expect, it, vi } from "vitest";
import { EmailServiceResendImpl } from "./email-service-resend-impl";
import { locator_common_EnvService } from "../../locators/locator_env-service";

vi.mock("resend", () => {
  const sendMock = vi.fn();
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

    const envService = locator_common_EnvService();

    const emailService = new EmailServiceResendImpl(envService);
    await emailService.sendVerificationCode(email, verificationCode);

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

    const envService = locator_common_EnvService();
    const emailService = new EmailServiceResendImpl(envService);
    await emailService.sendForgotPasswordLink(email, token);

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
