import type { Lazy } from "../common/di/locator-types";
import { locator_courses_CoursesRepository } from "../courses/locators/locator_courses-repository";
import { locator_profile_GetMyProfileUseCase } from "../profile/locators/locator_get-my-profile-use-case";
import type { GetCoursePracticeCountUseCase } from "./domain/use-cases/get-course-practice-count-use-case";
import type { GetNextPracticeCardsUseCase } from "./domain/use-cases/get-next-practice-cards-use-case";
import type { GetPracticeCardsUseCase } from "./domain/use-cases/get-practice-cards-use-case";
import type { PracticeUseCase } from "./domain/use-cases/practice-use-case";
import { locator_practice_PracticeCardsRepository } from "./locators/locator_practice-cards-repository";
import { locator_practice_ReviewLogsRepository } from "./locators/locator_review-logs-repository";

/**
 * Interface of the service locator of the Practice module
 */
interface PracticeLocator {
  GetNextPracticeCardsUseCase: Lazy<GetNextPracticeCardsUseCase>;
  PracticeUseCase: Lazy<PracticeUseCase>;
  GetPracticeCardsUseCase: Lazy<GetPracticeCardsUseCase>;
  GetCoursePracticeCountUseCase: Lazy<GetCoursePracticeCountUseCase>;
}

/**
 * The service locator of the Practice module
 */
export const practiceLocator: PracticeLocator = {
  async GetNextPracticeCardsUseCase() {
    const file = await import(
      "./domain/use-cases/get-next-practice-cards-use-case"
    );
    return new file.GetNextPracticeCardsUseCase(
      locator_profile_GetMyProfileUseCase(),
      locator_courses_CoursesRepository(),
      await this.GetPracticeCardsUseCase(),
    );
  },
  async PracticeUseCase() {
    const file = await import("./domain/use-cases/practice-use-case");
    return new file.PracticeUseCase(
      locator_profile_GetMyProfileUseCase(),
      locator_courses_CoursesRepository(),
      locator_practice_PracticeCardsRepository(),
      locator_practice_ReviewLogsRepository(),
    );
  },
  async GetPracticeCardsUseCase() {
    const file = await import("./domain/use-cases/get-practice-cards-use-case");
    return new file.GetPracticeCardsUseCase(
      locator_practice_ReviewLogsRepository(),
      locator_practice_PracticeCardsRepository(),
    );
  },
  async GetCoursePracticeCountUseCase() {
    const file = await import(
      "../practice/domain/use-cases/get-course-practice-count-use-case"
    );
    return new file.GetCoursePracticeCountUseCase(
      locator_practice_PracticeCardsRepository(),
      locator_practice_ReviewLogsRepository(),
    );
  },
};
