import { shuffle } from "@/src/common/domain/utils/array";
import { locator } from "@/src/common/locator";
import { CourseEnrollmentModel } from "@/src/courses/domain/models/course-enrollment-model";
import { CourseModel } from "@/src/courses/domain/models/course-model";

interface FetchPracticeCardsInput {
  course: CourseModel;
  enrollment: CourseEnrollmentModel;
}
export async function fetchPracticeCards({
  course,
  enrollment,
}: FetchPracticeCardsInput) {
  const courseEnrollmentId = enrollment.id;

  const reviewLogsRepository = await locator.ReviewLogsRepository();
  const practiceCardsRepository = await locator.PracticeCardsRepository();

  const newReviewsCountPromise =
    reviewLogsRepository.getReviewsOfNewCardsCount(courseEnrollmentId);
  const cardsPerSessionCount = enrollment.config.cardsPerSessionCount;
  const newCardsPromise = practiceCardsRepository.getUnpracticed({
    courseEnrollmentId,
    courseId: course.id,
    limit: cardsPerSessionCount,
  });
  const dueCardsPromise = practiceCardsRepository.getDue({
    courseEnrollmentId,
    limit: cardsPerSessionCount,
  });

  const newReviewsCount = await newReviewsCountPromise;
  const cardsToLearnCount = Math.max(
    0,
    enrollment.config.dailyNewCardsCount - newReviewsCount,
  );
  const newCards = cardsToLearnCount > 0 ? await newCardsPromise : [];
  const newCardsToLearn = newCards.slice(0, cardsToLearnCount);
  const dueCards = await dueCardsPromise;
  const cards = shuffle([...newCardsToLearn, ...dueCards]);
  return cards.slice(0, cardsPerSessionCount);
}
