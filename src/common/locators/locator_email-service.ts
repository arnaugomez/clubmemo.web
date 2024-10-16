import { EmailServiceFakeImpl } from "../data/services/email-service-fake-impl";
import { EmailServiceResendImpl } from "../data/services/email-service-resend-impl";
import type { Dependency } from "../di/locator-types";
import type { EmailService } from "../domain/interfaces/email-service";
import { locator_common_EnvService } from "./locator_env-service";

export const locator_common_EmailService: Dependency<EmailService> = () => {
  const envService = locator_common_EnvService();
  if (envService.sendEmail) {
    return new EmailServiceResendImpl(envService);
  }
  return new EmailServiceFakeImpl(envService);
};
