import type { CourseEnrollmentModel } from "@/src/courses/domain/models/course-enrollment-model";
import type { PracticeCardsRepository } from "../interfaces/practice-cards-repository";
import type { ReviewLogsRepository } from "../interfaces/review-logs-repository";
import { CoursePracticeCountModel } from "../models/course-practice-count-model";

/**
 * Gets the number of due cards and new cards that a user should practice for
 * a course
 * @param courseEnrollment The course enrollment of the user
 * @returns The number of due cards and new cards that the user should practice
 */
export class GetCoursePracticeCountUseCase {
  constructor(
    private readonly practiceCardsRepository: PracticeCardsRepository,
    private readonly reviewLogsRepository: ReviewLogsRepository,
  ) {}

  async execute(
    courseEnrollment: CourseEnrollmentModel,
  ): Promise<CoursePracticeCountModel> {
    const [dueCount, newCardsCount, reviewsOfNewCardsCount] = await Promise.all(
      [
        this.practiceCardsRepository.getDueCount(courseEnrollment.id),
        this.practiceCardsRepository.getNewCount({
          courseId: courseEnrollment.courseId,
          courseEnrollmentId: courseEnrollment.id,
        }),
        this.reviewLogsRepository.getReviewsOfNewCardsCount(
          courseEnrollment.id,
        ),
      ],
    );
    return new CoursePracticeCountModel({
      dueCount,
      newCount: Math.min(
        courseEnrollment.config.getNewCount(reviewsOfNewCardsCount),
        newCardsCount,
      ),
    });
  }
}
