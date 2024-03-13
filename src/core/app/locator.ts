import singleton from "memoize-one";
import { EmailService } from "./domain/interfaces/email-service";
import { EnvService } from "./domain/interfaces/env-service";

type Dependency<T> = () => Promise<T>;

interface Locator {
  EnvService: Dependency<EnvService>;
  EmailService: Dependency<EmailService>;
}

/**
 * A simple service locator for dependency injection.
 */
export const locator: Locator = {
  EnvService: singleton(async () => {
    const file = await import("./data/services/env-service-impl");
    return new file.EnvServiceImpl();
  }),
  async EmailService() {
    const envService = await this.EnvService();
    const file = await import("./data/services/email-service-impl");
    return new file.EmailServiceImpl(envService);
  },
};
