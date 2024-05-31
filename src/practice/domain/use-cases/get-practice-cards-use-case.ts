import { shuffle } from "@/src/common/domain/utils/array";
import type { CourseEnrollmentModel } from "@/src/courses/domain/models/course-enrollment-model";
import type { CourseModel } from "@/src/courses/domain/models/course-model";
import type { PracticeCardsRepository } from "../interfaces/practice-cards-repository";
import type { ReviewLogsRepository } from "../interfaces/review-logs-repository";

export class GetPracticeCardsUseCase {
  constructor(
    private readonly reviewLogsRepository: ReviewLogsRepository,
    private readonly practiceCardsRepository: PracticeCardsRepository,
  ) {}

  async execute({ course, enrollment }: GetPracticeCardsInputModel) {
    const courseEnrollmentId = enrollment.id;

    const reviewsOfNewCardsCountPromise =
      this.reviewLogsRepository.getReviewsOfNewCardsCount(courseEnrollmentId);
    const cardsPerSessionCount = enrollment.config.cardsPerSessionCount;
    const newCardsPromise = this.practiceCardsRepository.getNew({
      courseEnrollmentId,
      courseId: course.id,
      limit: cardsPerSessionCount,
    });
    const dueCardsPromise = this.practiceCardsRepository.getDue({
      courseEnrollmentId,
      limit: cardsPerSessionCount,
    });

    const reviewsOfNewCardsCount = await reviewsOfNewCardsCountPromise;
    const cardsToLearnCount = enrollment.config.getNewCount(
      reviewsOfNewCardsCount,
    );
    const newCards = cardsToLearnCount > 0 ? await newCardsPromise : [];
    const newCardsToLearn = newCards.slice(0, cardsToLearnCount);
    const dueCards = await dueCardsPromise;
    const cards = shuffle([...newCardsToLearn, ...dueCards]);
    return cards.slice(0, cardsPerSessionCount);
  }
}

export interface GetPracticeCardsInputModel {
  course: CourseModel;
  enrollment: CourseEnrollmentModel;
}
