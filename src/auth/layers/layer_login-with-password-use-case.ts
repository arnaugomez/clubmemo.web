import * as Layer from "effect/Layer";
import {
  LoginWithPasswordUseCase,
  LoginWithPasswordUseCaseService,
} from "../domain/use-cases/login-with-password-use-case";

export { LoginWithPasswordUseCaseService };
export const LoginWithPasswordUseCaseLive = Layer.effect(
  LoginWithPasswordUseCaseService,
  LoginWithPasswordUseCase.make,
);
