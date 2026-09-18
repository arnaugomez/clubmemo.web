import * as Layer from "effect/Layer";
import {
  VerifyEmailUseCase,
  VerifyEmailUseCaseService,
} from "../domain/use-cases/verify-email-use-case";

export { VerifyEmailUseCaseService };
export const VerifyEmailUseCaseLive = Layer.effect(
  VerifyEmailUseCaseService,
  VerifyEmailUseCase.make,
);
