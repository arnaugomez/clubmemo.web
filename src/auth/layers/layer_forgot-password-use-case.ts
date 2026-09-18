import * as Layer from "effect/Layer";
import {
  ForgotPasswordUseCase,
  ForgotPasswordUseCaseService,
} from "../domain/use-cases/forgot-password-use-case";

export { ForgotPasswordUseCaseService };
export const ForgotPasswordUseCaseLive = Layer.effect(
  ForgotPasswordUseCaseService,
  ForgotPasswordUseCase.make,
);
