import * as Layer from "effect/Layer";
import {
  ChangePasswordUseCase,
  ChangePasswordUseCaseService,
} from "../domain/use-cases/change-password-use-case";

export { ChangePasswordUseCaseService };
export const ChangePasswordUseCaseLive = Layer.effect(
  ChangePasswordUseCaseService,
  ChangePasswordUseCase.make,
);
