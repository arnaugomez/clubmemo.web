import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import { CoursesRepository } from "@/src/courses/domain/interfaces/courses-repository";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import { PracticeCardsRepository } from "../interfaces/practice-cards-repository";
import { ReviewLogsRepository } from "../interfaces/review-logs-repository";
import type { PracticeCardModel } from "../models/practice-card-model";
import type { ReviewLogModel } from "../models/review-log-model";

/**
 * Practices a card for a course, and logs the review and its result
 *
 * A new card is created if the card is new, or the card is updated if it
 * already existed.
 *
 * A new review log is created and stored in the persistence layer.
 *
 * The newly created card and review log are returned.
 *
 * @param input The input data to practice a card, including the course id, the
 * card data, and the review log data
 * @throws {ProfileDoesNotExistError} When the user is not logged in
 * @throws {CourseDoesNotExistError} When the course does not exist
 * @throws {NoPermissionError} When the user does not have permission to
 * practice the course. This happens when the profile cannot view the course
 * (because it is private), when the profile is not enrolled in the course, and
 * when the card does not belong to the profile.
 * @returns The new card data and the new review log data.
 */
export class PracticeUseCase extends Context.Service<PracticeUseCase>()(
  "clubmemo/practice/domain/use-cases/practice-use-case",
  {
    make: Effect.gen(function* () {
      const getMyProfileUseCase = yield* GetMyProfileUseCase;
      const coursesRepository = yield* CoursesRepository;
      const cardsRepository = yield* PracticeCardsRepository;
      const reviewLogsRepository = yield* ReviewLogsRepository;
      const execute = Effect.fn("PracticeUseCase.execute")(function* ({
        card,
        courseId,
        reviewLog,
      }: PracticeInputModel) {
        const profile = yield* getMyProfileUseCase.execute();
        if (!profile) return yield* Effect.fail(new ProfileDoesNotExistError());

        const course = yield* coursesRepository.getDetail({
          id: courseId,
          profileId: profile.id,
        });

        if (!course) return yield* Effect.fail(new CourseDoesNotExistError());
        if (
          !course.canView ||
          !course.isEnrolled ||
          course.enrollment?.id !== card.courseEnrollmentId
        ) {
          return yield* Effect.fail(new NoPermissionError());
        }

        // Create a new card or update it if it already exists
        const newCard =
          (yield* card.isNew
            ? cardsRepository.create(card)
            : cardsRepository.update(card)) ?? card;

        reviewLog.data.cardId = newCard.id;
        const newReviewLog = yield* reviewLogsRepository.create(reviewLog);

        return { newCard, newReviewLog };
      });
      return { execute };
    }),
  },
) {}

interface PracticeInputModel {
  courseId: string;
  card: PracticeCardModel;
  reviewLog: ReviewLogModel;
}

export const PracticeUseCaseService = PracticeUseCase;
