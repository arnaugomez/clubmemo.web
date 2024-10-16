import type { Dependency } from "@/src/common/di/locator-types";
import { locator_courses_CoursesRepository } from "@/src/courses/locators/locator_courses-repository";
import { locator_profile_GetMyProfileUseCase } from "@/src/profile/locators/locator_get-my-profile-use-case";
import { PracticeUseCase } from "../domain/use-cases/practice-use-case";
import { locator_practice_PracticeCardsRepository } from "./locator_practice-cards-repository";
import { locator_practice_ReviewLogsRepository } from "./locator_review-logs-repository";

export const locator_practice_PracticeUseCase: Dependency<
  PracticeUseCase
> = () =>
  new PracticeUseCase(
    locator_profile_GetMyProfileUseCase(),
    locator_courses_CoursesRepository(),
    locator_practice_PracticeCardsRepository(),
    locator_practice_ReviewLogsRepository(),
  );
