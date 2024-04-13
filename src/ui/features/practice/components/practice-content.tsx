import { locator } from "@/src/core/common/locator";
import { shuffle } from "@/src/core/common/utils/array";
import { CourseEnrollmentModel } from "@/src/core/courses/domain/models/course-enrollment-model";
import { CourseModel } from "@/src/core/courses/domain/models/course-model";
import { PracticeEmptyState } from "./practice-empty-state";
import { PracticeWizard } from "./practice-wizard";

interface PracticeContentProps {
  course: CourseModel;
  enrollment: CourseEnrollmentModel;
}
// TODO: extract use case class
export async function PracticeContent({
  course,
  enrollment,
}: PracticeContentProps) {
  const courseEnrollmentId = enrollment.id;

  const reviewLogsRepository = await locator.ReviewLogsRepository();
  const practiceCardsRepository = await locator.PracticeCardsRepository();

  const newReviewsCountPromise =
    reviewLogsRepository.getReviewsOfNewCardsCount(courseEnrollmentId);
  const newCardsPromise = practiceCardsRepository.getUnpracticed({
    courseEnrollmentId,
    courseId: course.id,
    limit: enrollment.config.cardsPerSessionCount,
  });
  const dueCardsPromise = practiceCardsRepository.getDue({
    courseEnrollmentId,
    limit: enrollment.config.cardsPerSessionCount,
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
  if (!cards.length) {
    return <PracticeEmptyState />;
  }
  return (
    <PracticeWizard
      courseData={course.data}
      cardsData={cards.map((c) => c.data)}
    />
  );
}
