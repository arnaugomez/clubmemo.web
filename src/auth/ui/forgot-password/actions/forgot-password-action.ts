"use server";

import { locator } from "@/src/common/locator";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { ForgotPasswordActionModel } from "../schemas/forgot-password-action-schema";
import { ForgotPasswordActionSchema } from "../schemas/forgot-password-action-schema";

export async function forgotPasswordAction(input: ForgotPasswordActionModel) {
  const IpService = await locator.IpService();
  const ip = await IpService.getIp();
  const rateLimitKey = `forgotPasswordAction/${ip}`;
  const rateLimitsRepository = locator.RateLimitsRepository();

  try {
    const { email } = ForgotPasswordActionSchema.parse(input);
    await rateLimitsRepository.check(rateLimitKey, 40);

    const usersRepository = await locator.UsersRepository();
    const user = await usersRepository.getByEmail(email);
    if (!user) {
      return ActionResponse.formError("email", {
        message: "No existe un usuario con ese correo",
        type: "userDoesNotExist",
      });
    }

    const forgotPasswordTokensRepository =
      await locator.ForgotPasswordTokensRepository();
    const token = await forgotPasswordTokensRepository.generate(user.id);

    const emailService = await locator.EmailService();
    await emailService.sendForgotPasswordLink(user.email, token);

    await rateLimitsRepository.increment(rateLimitKey);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
