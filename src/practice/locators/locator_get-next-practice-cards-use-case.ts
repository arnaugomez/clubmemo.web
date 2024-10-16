import type { Dependency } from "@/src/common/di/locator-types";
import { locator_courses_CoursesRepository } from "@/src/courses/locators/locator_courses-repository";
import { locator_profile_GetMyProfileUseCase } from "@/src/profile/locators/locator_get-my-profile-use-case";
import { GetNextPracticeCardsUseCase } from "../domain/use-cases/get-next-practice-cards-use-case";
import { locator_practice_GetPracticeCardsUseCase } from "./locator_get-practice-cards-use-case";

export const locator_practice_GetNextPracticeCardsUseCase: Dependency<
  GetNextPracticeCardsUseCase
> = () =>
  new GetNextPracticeCardsUseCase(
    locator_profile_GetMyProfileUseCase(),
    locator_courses_CoursesRepository(),
    locator_practice_GetPracticeCardsUseCase(),
  );
