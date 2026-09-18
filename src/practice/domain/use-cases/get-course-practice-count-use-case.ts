import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import type { CourseEnrollmentModel } from "@/src/courses/domain/models/course-enrollment-model";
import { PracticeCardsRepository } from "../interfaces/practice-cards-repository";
import { ReviewLogsRepository } from "../interfaces/review-logs-repository";
import { CoursePracticeCountModel } from "../models/course-practice-count-model";

/**
 * Gets the number of due cards and new cards that a user should practice for
 * a course
 * @param courseEnrollment The course enrollment of the user
 * @returns The number of due cards and new cards that the user should practice
 */
export class GetCoursePracticeCountUseCase extends Context.Service<GetCoursePracticeCountUseCase>()(
  "clubmemo/practice/domain/use-cases/get-course-practice-count-use-case",
  {
    make: Effect.gen(function* () {
      const practiceCardsRepository = yield* PracticeCardsRepository;
      const reviewLogsRepository = yield* ReviewLogsRepository;
      const execute = Effect.fn("GetCoursePracticeCountUseCase.execute")(
        function* (courseEnrollment: CourseEnrollmentModel) {
          const [dueCount, newCardsCount, reviewsOfNewCardsCount] =
            yield* Effect.all(
              [
                practiceCardsRepository.getDueCount(courseEnrollment.id),
                practiceCardsRepository.getNewCount({
                  courseId: courseEnrollment.courseId,
                  courseEnrollmentId: courseEnrollment.id,
                }),
                reviewLogsRepository.getReviewsOfNewCardsCount(
                  courseEnrollment.id,
                ),
              ],
              { concurrency: "unbounded" },
            );
          return new CoursePracticeCountModel({
            dueCount,
            newCount: Math.min(
              courseEnrollment.config.getNewCount(reviewsOfNewCardsCount),
              newCardsCount,
            ),
          });
        },
      );
      return { execute };
    }),
  },
) {}

export const GetCoursePracticeCountUseCaseService =
  GetCoursePracticeCountUseCase;
