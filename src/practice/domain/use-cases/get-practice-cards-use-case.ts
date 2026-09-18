import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { shuffle } from "@/src/common/domain/utils/array";
import type { CourseEnrollmentModel } from "@/src/courses/domain/models/course-enrollment-model";
import type { CourseModel } from "@/src/courses/domain/models/course-model";
import { PracticeCardsRepository } from "../interfaces/practice-cards-repository";
import { ReviewLogsRepository } from "../interfaces/review-logs-repository";

/**
 * Gets a list of the practice cards that the user should practice in the next
 * practice session
 * @param input The course and the enrollment of the current profile to that
 * course
 * @returns A list of practice cards that should be practiced in the next
 * practice session.
 */
export class GetPracticeCardsUseCase extends Context.Service<GetPracticeCardsUseCase>()(
  "clubmemo/practice/domain/use-cases/get-practice-cards-use-case",
  {
    make: Effect.gen(function* () {
      const reviewLogsRepository = yield* ReviewLogsRepository;
      const practiceCardsRepository = yield* PracticeCardsRepository;
      const execute = Effect.fn("GetPracticeCardsUseCase.execute")(function* ({
        course,
        enrollment,
      }: GetPracticeCardsInputModel) {
        const courseEnrollmentId = enrollment.id;

        const reviewsOfNewCardsCountPromise =
          reviewLogsRepository.getReviewsOfNewCardsCount(courseEnrollmentId);
        const cardsPerSessionCount = enrollment.config.cardsPerSessionCount;
        const newCardsPromise = practiceCardsRepository.getNew({
          courseEnrollmentId,
          courseId: course.id,
          limit: cardsPerSessionCount,
        });
        const dueCardsPromise = practiceCardsRepository.getDue({
          courseEnrollmentId,
          limit: cardsPerSessionCount,
        });

        const reviewsOfNewCardsCount = yield* reviewsOfNewCardsCountPromise;
        const cardsToLearnCount = enrollment.config.getNewCount(
          reviewsOfNewCardsCount,
        );
        const newCards = cardsToLearnCount > 0 ? yield* newCardsPromise : [];
        const newCardsToLearn = newCards.slice(0, cardsToLearnCount);
        const dueCards = yield* dueCardsPromise;
        const cards = shuffle([...newCardsToLearn, ...dueCards]);
        return cards.slice(0, cardsPerSessionCount);
      });
      return { execute };
    }),
  },
) {}

export interface GetPracticeCardsInputModel {
  course: CourseModel;
  enrollment: CourseEnrollmentModel;
}

export const GetPracticeCardsUseCaseService = GetPracticeCardsUseCase;
