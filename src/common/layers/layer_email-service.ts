import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { EnvService } from "@/src/common/layers/layer_env-service";
import { EmailServiceFakeImpl } from "../data/services/email-service-fake-impl";
import { EmailServiceResendImpl } from "../data/services/email-service-resend-impl";
import { EmailService } from "../domain/interfaces/email-service";

export { EmailService };
export const EmailServiceLive = Layer.effect(
  EmailService,
  Effect.gen(function* () {
    const envService = yield* EnvService;
    if (envService.sendEmail) {
      return new EmailServiceResendImpl(envService);
    }
    return new EmailServiceFakeImpl(envService);
  }),
);
