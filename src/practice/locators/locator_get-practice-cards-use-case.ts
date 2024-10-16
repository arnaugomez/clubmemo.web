import type { Dependency } from "@/src/common/di/locator-types";
import { GetPracticeCardsUseCase } from "../domain/use-cases/get-practice-cards-use-case";
import { locator_practice_PracticeCardsRepository } from "./locator_practice-cards-repository";
import { locator_practice_ReviewLogsRepository } from "./locator_review-logs-repository";

export const locator_practice_GetPracticeCardsUseCase: Dependency<
  GetPracticeCardsUseCase
> = () =>
  new GetPracticeCardsUseCase(
    locator_practice_ReviewLogsRepository(),
    locator_practice_PracticeCardsRepository(),
  );
