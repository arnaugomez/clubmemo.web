import * as Layer from "effect/Layer";
import {
  SignupUseCase,
  SignupUseCaseService,
} from "../domain/use-cases/signup-use-case";

export { SignupUseCaseService };
export const SignupUseCaseLive = Layer.effect(
  SignupUseCaseService,
  SignupUseCase.make,
);
