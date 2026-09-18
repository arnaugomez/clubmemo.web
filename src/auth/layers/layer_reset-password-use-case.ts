import * as Layer from "effect/Layer";
import {
  ResetPasswordUseCase,
  ResetPasswordUseCaseService,
} from "../domain/use-cases/reset-password-use-case";

export { ResetPasswordUseCaseService };
export const ResetPasswordUseCaseLive = Layer.effect(
  ResetPasswordUseCaseService,
  ResetPasswordUseCase.make,
);
