import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { DatabaseService } from "@/src/common/layers/layer_database-service";
import { EmailVerificationCodesRepositoryImpl } from "../data/repositories/email-verification-codes-repository-impl";
import { EmailVerificationCodesRepository } from "../domain/interfaces/email-verification-codes-repository";

export { EmailVerificationCodesRepository };
export const EmailVerificationCodesRepositoryLive = Layer.effect(
  EmailVerificationCodesRepository,
  Effect.gen(function* () {
    return new EmailVerificationCodesRepositoryImpl(yield* DatabaseService);
  }),
);
