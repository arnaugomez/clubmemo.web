"use server";
import { UserAlreadyExistsError } from "@/src/auth/domain/errors/auth-errors";
import { SignupWithPasswordModel } from "@/src/auth/domain/interfaces/auth-service";
import { locator } from "@/src/common/locator";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signupAction(data: SignupWithPasswordModel) {
  try {
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
      return ActionResponse.formError({
        name: "email",
        type: "exists",
        message: "A user with this email already exists",
      });
    } else {
      return ActionResponse.formGlobalError("general");
    }
  }
  redirect(`/auth/verify-email`);
}
