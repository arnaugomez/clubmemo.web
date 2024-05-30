import type { GetPracticeCardsInputModel } from "../../domain/use-cases/get-practice-cards-use-case";
import { practiceLocator } from "../../practice-locator";

export async function fetchPracticeCards(input: GetPracticeCardsInputModel) {
  const useCase = await practiceLocator.GetPracticeCardsUseCase();
  return await useCase.execute(input);
}
