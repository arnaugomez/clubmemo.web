import { locator } from "../common/di/locator";
import type { Dependency, Lazy } from "../common/di/locator-types";
import type { ChangePasswordUseCase } from "./domain/use-cases/change-password-use-case";
import type { DeleteUserUseCase } from "./domain/use-cases/delete-user-use-case";
import type { ForgotPasswordUseCase } from "./domain/use-cases/forgot-password-use-case";
import { GetSessionUseCase } from "./domain/use-cases/get-session-use-case";
import type { LoginWithPasswordUseCase } from "./domain/use-cases/login-with-password-use-case";
import type { LogoutUseCase } from "./domain/use-cases/logout-use-case";
import type { ResetPasswordUseCase } from "./domain/use-cases/reset-password-use-case";
import type { SignupUseCase } from "./domain/use-cases/signup-use-case";
import type { VerifyEmailUseCase } from "./domain/use-cases/verify-email-use-case";

interface AuthLocator {
  GetSessionUseCase: Dependency<GetSessionUseCase>;
  LoginWithPasswordUseCase: Lazy<LoginWithPasswordUseCase>;
  DeleteUserUseCase: Lazy<DeleteUserUseCase>;
  ChangePasswordUseCase: Lazy<ChangePasswordUseCase>;
  LogoutUseCase: Lazy<LogoutUseCase>;
  ForgotPasswordUseCase: Lazy<ForgotPasswordUseCase>;
  ResetPasswordUseCase: Lazy<ResetPasswordUseCase>;
  SignupUseCase: Lazy<SignupUseCase>;
  VerifyEmailUseCase: Lazy<VerifyEmailUseCase>;
}

export const authLocator: AuthLocator = {
  GetSessionUseCase() {
    return new GetSessionUseCase(
      locator.AuthService(),
      locator.CookieService(),
    );
  },
  async LoginWithPasswordUseCase() {
    const file = await import(
      "./domain/use-cases/login-with-password-use-case"
    );
    return new file.LoginWithPasswordUseCase(
      locator.AuthService(),
      await locator.IpService(),
      locator.RateLimitsRepository(),
      locator.CookieService(),
    );
  },
  DeleteUserUseCase: async () => {
    const file = await import("./domain/use-cases/delete-user-use-case");
    return new file.DeleteUserUseCase(
      authLocator.GetSessionUseCase(),
      locator.AuthService(),
      await locator.UsersRepository(),
      await locator.ProfilesRepository(),
    );
  },
  ChangePasswordUseCase: async () => {
    const file = await import("./domain/use-cases/change-password-use-case");
    return new file.ChangePasswordUseCase(
      authLocator.GetSessionUseCase(),
      locator.AuthService(),
      locator.RateLimitsRepository(),
      locator.CookieService(),
    );
  },
  async LogoutUseCase() {
    const file = await import("./domain/use-cases/logout-use-case");
    return new file.LogoutUseCase(
      this.GetSessionUseCase(),
      locator.AuthService(),
      locator.CookieService(),
    );
  },
  async ForgotPasswordUseCase() {
    const file = await import("./domain/use-cases/forgot-password-use-case");
    return new file.ForgotPasswordUseCase(
      await locator.IpService(),
      locator.RateLimitsRepository(),
      await locator.UsersRepository(),
      await locator.ForgotPasswordTokensRepository(),
      await locator.EmailService(),
    );
  },
  async ResetPasswordUseCase() {
    const file = await import("./domain/use-cases/reset-password-use-case");
    return new file.ResetPasswordUseCase(
      await locator.IpService(),
      locator.RateLimitsRepository(),
      await locator.UsersRepository(),
      locator.AuthService(),
      await locator.ForgotPasswordTokensRepository(),
    );
  },
  async SignupUseCase() {
    const file = await import("./domain/use-cases/signup-use-case");
    return new file.SignupUseCase(
      await locator.IpService(),
      locator.RateLimitsRepository(),
      locator.AuthService(),
      await locator.ProfilesRepository(),
      await locator.EmailService(),
      await locator.EmailVerificationCodesRepository(),
      locator.CookieService(),
    );
  },
  async VerifyEmailUseCase() {
    const file = await import("./domain/use-cases/verify-email-use-case");
    return new file.VerifyEmailUseCase(
      this.GetSessionUseCase(),
      await locator.EmailVerificationCodesRepository(),
      locator.AuthService(),
      locator.RateLimitsRepository(),
      locator.CookieService(),
    );
  },
};
