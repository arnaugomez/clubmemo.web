import type { Dependency } from "@/src/common/di/locator-types";
import { locator_profiles_ProfilesRepository } from "@/src/profile/locators/locator_profiles-repository";
import { GetInterestingCoursesUseCase } from "../domain/use-cases/get-interesting-courses-use-case";
import { locator_courses_CoursesRepository } from "./locator_courses-repository";

export const locator_courses_GetInterestingCoursesUseCase: Dependency<
  GetInterestingCoursesUseCase
> = () =>
  new GetInterestingCoursesUseCase(
    locator_profiles_ProfilesRepository(),
    locator_courses_CoursesRepository(),
  );
