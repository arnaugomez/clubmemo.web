import { locator } from "../common/di/locator";
import type { Dependency, Lazy } from "../common/di/locator-types";
import { locator_common_CookieService } from "../common/locators/locator_cookie-service";
import { locator_common_EmailService } from "../common/locators/locator_email-service";
import { locator_common_IpService } from "../common/locators/locator_ip-service";
import { locator_profiles_ProfilesRepository } from "../profile/locators/locator_profiles-repository";
import { locator_rateLimits_RateLimitsRepository } from "../rate-limits/locators/locator_rate-limits-repository";
import type { ChangePasswordUseCase } from "./domain/use-cases/change-password-use-case";
import type { DeleteUserUseCase } from "./domain/use-cases/delete-user-use-case";
import type { ForgotPasswordUseCase } from "./domain/use-cases/forgot-password-use-case";
import { GetSessionUseCase } from "./domain/use-cases/get-session-use-case";
import type { LoginWithPasswordUseCase } from "./domain/use-cases/login-with-password-use-case";
import type { LogoutUseCase } from "./domain/use-cases/logout-use-case";
import type { ResetPasswordUseCase } from "./domain/use-cases/reset-password-use-case";
import type { SignupUseCase } from "./domain/use-cases/signup-use-case";
import type { VerifyEmailUseCase } from "./domain/use-cases/verify-email-use-case";

/**
 * Service locator for the auth module
 */
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

/**
 * Service locator for the auth module
 */
export const authLocator: AuthLocator = {
  GetSessionUseCase() {
    return new GetSessionUseCase(
      locator.AuthService(),
      locator_common_CookieService(),
    );
  },
  async LoginWithPasswordUseCase() {
    const file = await import(
      "./domain/use-cases/login-with-password-use-case"
    );
    return new file.LoginWithPasswordUseCase(
      locator.AuthService(),
      locator_common_IpService(),
      locator_rateLimits_RateLimitsRepository(),
      locator_common_CookieService(),
    );
  },
  DeleteUserUseCase: async () => {
    const file = await import("./domain/use-cases/delete-user-use-case");
    return new file.DeleteUserUseCase(
      authLocator.GetSessionUseCase(),
      locator.AuthService(),
      await locator.UsersRepository(),
      locator_profiles_ProfilesRepository(),
    );
  },
  ChangePasswordUseCase: async () => {
    const file = await import("./domain/use-cases/change-password-use-case");
    return new file.ChangePasswordUseCase(
      authLocator.GetSessionUseCase(),
      locator.AuthService(),
      locator_rateLimits_RateLimitsRepository(),
      locator_common_CookieService(),
    );
  },
  async LogoutUseCase() {
    const file = await import("./domain/use-cases/logout-use-case");
    return new file.LogoutUseCase(
      this.GetSessionUseCase(),
      locator.AuthService(),
      locator_common_CookieService(),
    );
  },
  async ForgotPasswordUseCase() {
    const file = await import("./domain/use-cases/forgot-password-use-case");
    return new file.ForgotPasswordUseCase(
      locator_common_IpService(),
      locator_rateLimits_RateLimitsRepository(),
      await locator.UsersRepository(),
      await locator.ForgotPasswordTokensRepository(),
      locator_common_EmailService(),
    );
  },
  async ResetPasswordUseCase() {
    const file = await import("./domain/use-cases/reset-password-use-case");
    return new file.ResetPasswordUseCase(
      locator_common_IpService(),
      locator_rateLimits_RateLimitsRepository(),
      await locator.UsersRepository(),
      locator.AuthService(),
      await locator.ForgotPasswordTokensRepository(),
    );
  },
  async SignupUseCase() {
    const file = await import("./domain/use-cases/signup-use-case");
    return new file.SignupUseCase(
      locator_common_IpService(),
      locator_rateLimits_RateLimitsRepository(),
      locator.AuthService(),
      locator_profiles_ProfilesRepository(),
      await locator.EmailVerificationCodesRepository(),
      locator_common_EmailService(),
      locator_common_CookieService(),
    );
  },
  async VerifyEmailUseCase() {
    const file = await import("./domain/use-cases/verify-email-use-case");
    return new file.VerifyEmailUseCase(
      this.GetSessionUseCase(),
      await locator.EmailVerificationCodesRepository(),
      locator.AuthService(),
      locator_rateLimits_RateLimitsRepository(),
      locator_common_CookieService(),
    );
  },
};
