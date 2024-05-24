"use server";
import { locator } from "@/src/common/locator";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { SignupActionModel } from "../schemas/signup-action-schema";
import { SignupActionSchema } from "../schemas/signup-action-schema";
import { UserAlreadyExistsError } from "@/src/auth/domain/errors/auth-errors";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";

export async function signupAction(input: SignupActionModel) {
  try {
    const data = SignupActionSchema.parse(input);
    const authService = locator.AuthService();
    const { userId, sessionCookie } =
      await authService.signupWithPassword(data);

    const profilesRepository = await locator.ProfilesRepository();
    await profilesRepository.create(userId);

    const emailVerificationCodesRepository =
      await locator.EmailVerificationCodesRepository();
    const { code } = await emailVerificationCodesRepository.generate(userId);

    const emailService = await locator.EmailService();
    await emailService.sendVerificationCode(data.email, code);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch (e) {
    if (e instanceof UserAlreadyExistsError) {
      return ActionResponse.formError("name", {
        type: "exists",
        message: "A user with this email already exists",
      });
    }
    return ActionErrorHandler.handle(e);
  }
  redirect(`/auth/verify-email`);
}
