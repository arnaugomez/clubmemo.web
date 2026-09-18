import * as Layer from "effect/Layer";
import {
  GetNextPracticeCardsUseCase,
  GetNextPracticeCardsUseCaseService,
} from "../domain/use-cases/get-next-practice-cards-use-case";

export { GetNextPracticeCardsUseCaseService };
export const GetNextPracticeCardsUseCaseLive = Layer.effect(
  GetNextPracticeCardsUseCaseService,
  GetNextPracticeCardsUseCase.make,
);
