import type { Dependency } from "@/src/common/di/locator-types";
import { GetCoursePracticeCountUseCase } from "../domain/use-cases/get-course-practice-count-use-case";
import { locator_practice_PracticeCardsRepository } from "./locator_practice-cards-repository";
import { locator_practice_ReviewLogsRepository } from "./locator_review-logs-repository";

export const locator_practice_GetCoursePracticeCountUseCase: Dependency<
  GetCoursePracticeCountUseCase
> = () =>
  new GetCoursePracticeCountUseCase(
    locator_practice_PracticeCardsRepository(),
    locator_practice_ReviewLogsRepository(),
  );
