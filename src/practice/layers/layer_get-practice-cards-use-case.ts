import * as Layer from "effect/Layer";
import {
  GetPracticeCardsUseCase,
  GetPracticeCardsUseCaseService,
} from "../domain/use-cases/get-practice-cards-use-case";

export { GetPracticeCardsUseCaseService };
export const GetPracticeCardsUseCaseLive = Layer.effect(
  GetPracticeCardsUseCaseService,
  GetPracticeCardsUseCase.make,
);
