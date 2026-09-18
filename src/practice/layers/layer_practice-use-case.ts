import * as Layer from "effect/Layer";
import {
  PracticeUseCase,
  PracticeUseCaseService,
} from "../domain/use-cases/practice-use-case";

export { PracticeUseCaseService };
export const PracticeUseCaseLive = Layer.effect(
  PracticeUseCaseService,
  PracticeUseCase.make,
);
