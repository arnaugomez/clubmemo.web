import type { Lazy } from "../common/locator";
import { locator } from "../common/locator";
import { profileLocator } from "../profile/profile-locator";
import type { GetNextPracticeCardsUseCase } from "./domain/use-cases/get-next-practice-cards-use-case";
import type { PracticeUseCase } from "./domain/use-cases/practice-use-case";

interface PracticeLocator {
  GetNextPracticeCardsUseCase: Lazy<GetNextPracticeCardsUseCase>;
  PracticeUseCase: Lazy<PracticeUseCase>;
}

export const practiceLocator: PracticeLocator = {
  async GetNextPracticeCardsUseCase() {
    const file = await import(
      "./domain/use-cases/get-next-practice-cards-use-case"
    );
    return new file.GetNextPracticeCardsUseCase(
      await profileLocator.GetMyProfileUseCase(),
      await locator.CoursesRepository(),
    );
  },
  async PracticeUseCase() {
    const file = await import("./domain/use-cases/practice-use-case");
    return new file.PracticeUseCase(
      await profileLocator.GetMyProfileUseCase(),
      await locator.CoursesRepository(),
      await locator.PracticeCardsRepository(),
      await locator.ReviewLogsRepository(),
    );
  },
};
