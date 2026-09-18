import * as Layer from "effect/Layer";
import {
  LogoutUseCase,
  LogoutUseCaseService,
} from "../domain/use-cases/logout-use-case";

export { LogoutUseCaseService };
export const LogoutUseCaseLive = Layer.effect(
  LogoutUseCaseService,
  LogoutUseCase.make,
);
