import * as Layer from "effect/Layer";
import {
  GetSessionUseCase,
  GetSessionUseCaseService,
} from "../domain/use-cases/get-session-use-case";

export { GetSessionUseCaseService };
export const GetSessionUseCaseLive = Layer.effect(
  GetSessionUseCaseService,
  GetSessionUseCase.make,
);
