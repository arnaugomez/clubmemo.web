import memoizeOne from "memoize-one";
import { AuthServiceImpl } from "../auth/data/services/auth-service-impl";
import { AuthService } from "../auth/domain/interfaces/auth-service";
import { EmailVerificationCodesRepository } from "../auth/domain/interfaces/email-verification-codes-repository";
import { ForgotPasswordTokensRepository } from "../auth/domain/interfaces/forgot-password-tokens-repository";
import { UsersRepository } from "../auth/domain/interfaces/users-repository";
import { ProfilesRepository } from "../profile/domain/interfaces/profiles-repository";
import { EnvServiceImpl } from "./data/services/env-service-impl";
import { MongoServiceImpl } from "./data/services/mongodb-service-impl";
import { EmailService } from "./domain/interfaces/email-service";
import { EnvService } from "./domain/interfaces/env-service";
import { MongoService } from "./domain/interfaces/mongo-service";

export type Dependency<T> = () => T;
export type Lazy<T> = () => Promise<T>;

interface Locator {
  EnvService: Dependency<EnvService>;
  MongoService: Dependency<MongoService>;
  EmailService: Lazy<EmailService>;
  // Auth
  AuthService: Dependency<AuthService>;
  EmailVerificationCodesRepository: Lazy<EmailVerificationCodesRepository>;
  ForgotPasswordTokensRepository: Lazy<ForgotPasswordTokensRepository>;
  UsersRepository: Lazy<UsersRepository>;
  ProfilesRepository: Lazy<ProfilesRepository>;
}

export const singleton = memoizeOne;

/**
 * A simple service locator for dependency injection.
 */
export const locator: Locator = {
  EnvService: singleton(() => new EnvServiceImpl()),
  MongoService: singleton(() => new MongoServiceImpl(locator.EnvService())),
  async EmailService() {
    const envService = this.EnvService();
    if (envService.sendEmail) {
      const file = await import("./data/services/email-service-impl");
      return new file.EmailServiceImpl(envService);
    }
    const file = await import("./data/services/email-service-fake-impl");
    return new file.EmailServiceFakeImpl();
  },

  // Auth
  AuthService: singleton(
    () => new AuthServiceImpl(locator.EnvService(), locator.MongoService()),
  ),
  async EmailVerificationCodesRepository() {
    const file = await import(
      "../auth/data/repositories/email-verification-codes-repository-impl"
    );
    return new file.EmailVerificationCodesRepositoryImpl(this.MongoService());
  },
  async ForgotPasswordTokensRepository() {
    const file = await import(
      "../auth/data/repositories/forgot-password-tokens-repository-impl"
    );
    return new file.ForgotPasswordTokensRepositoryImpl(this.MongoService());
  },
  async UsersRepository() {
    const file = await import(
      "../auth/data/repositories/users-repository-impl"
    );
    return new file.UsersRepositoryImpl(this.MongoService());
  },

  // Profile
  async ProfilesRepository() {
    const file = await import(
      "../profile/data/repositories/profiles-repository-impl"
    );
    return new file.ProfilesRepositoryImpl(this.MongoService());
  },
};
