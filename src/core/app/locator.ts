import singleton from "memoize-one";
import { EmailService } from "./domain/interfaces/email-service";
import { EnvServiceImpl } from "./data/services/env-service-impl";
import { EnvService } from "./domain/interfaces/env-service";
import { MongoServiceImpl } from "./data/services/mongodb-service-impl";
import { MongoService } from "./domain/interfaces/mongo-service";
import { EmailVerificationCodesRepository } from "../auth/domain/interfaces/email-verification-codes-repository";

type Dependency<T> = () => T;
type Lazy<T> = () => Promise<T>;

interface Locator {
  EnvService: Dependency<EnvService>;
  MongoService: Dependency<MongoService>;
  EmailService: Lazy<EmailService>;
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
};
