import memoizeOne from "memoize-one";
import { AuthServiceImpl } from "../auth/data/services/auth-service-impl";
import { AuthService } from "../auth/domain/interfaces/auth-service";
import { EmailVerificationCodesRepository } from "../auth/domain/interfaces/email-verification-codes-repository";
import { EnvServiceImpl } from "./data/services/env-service-impl";
import { MongoServiceImpl } from "./data/services/mongodb-service-impl";
import { EmailService } from "./domain/interfaces/email-service";
import { EnvService } from "./domain/interfaces/env-service";
import { MongoService } from "./domain/interfaces/mongo-service";

const singleton = memoizeOne;

type Dependency<T> = () => T;
type Lazy<T> = () => Promise<T>;

interface Locator {
  EnvService: Dependency<EnvService>;
  MongoService: Dependency<MongoService>;
  EmailService: Lazy<EmailService>;
  // Auth
  AuthService: Dependency<AuthService>;
  EmailVerificationCodesRepository: Lazy<EmailVerificationCodesRepository>;
}

/**
 * A simple service locator for dependency injection.
 */
export const locator: Locator = {
  EnvService: singleton(() => new EnvServiceImpl()),
  MongoService: singleton(() => new MongoServiceImpl(locator.EnvService())),
  async EmailService() {
    const envService = this.EnvService();
    const file = await import("./data/services/email-service-impl");
    return new file.EmailServiceImpl(envService);
  },
  async EmailVerificationCodesRepository() {
    const file = await import(
      "../auth/data/repositories/email-verification-codes-repository-impl"
    );
    return new file.EmailVerificationCodesRepositoryImpl();
  },
  AuthService: singleton(() => new AuthServiceImpl()),
};
