import type { CourseEnrollmentModel } from "@/src/courses/domain/models/course-enrollment-model";
import type { PracticeCardsRepository } from "../interfaces/practice-cards-repository";
import type { ReviewLogsRepository } from "../interfaces/review-logs-repository";
import { CoursePracticeCountModel } from "../models/course-practice-count-model";

export class GetCoursePracticeCountUseCase {
  constructor(
    private readonly practiceCardsRepository: PracticeCardsRepository,
    private readonly reviewLogsRepository: ReviewLogsRepository,
  ) {}

  async execute(
    courseEnrollment: CourseEnrollmentModel,
  ): Promise<CoursePracticeCountModel> {
    const [dueCount, reviewsOfNewCardsCount] = await Promise.all([
      this.practiceCardsRepository.getUnpracticedCount(courseEnrollment.id),
      this.reviewLogsRepository.getReviewsOfNewCardsCount(courseEnrollment.id),
    ]);

    return new CoursePracticeCountModel({
      dueCount,
      newCount: courseEnrollment.config.getNewCount(reviewsOfNewCardsCount),
    });
  }
}
