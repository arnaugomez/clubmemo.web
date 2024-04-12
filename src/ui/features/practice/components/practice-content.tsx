import { locator } from "@/src/core/common/locator";
import { shuffle } from "@/src/core/common/utils/array";
import { CourseModel } from "@/src/core/courses/domain/models/course-model";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
import utc from "dayjs/plugin/utc";
import { PracticeEmptyState } from "./practice-empty-state";
import { PracticeWizard } from "./practice-wizard";
import { CourseEnrollmentModel } from "@/src/core/courses/domain/models/course-enrollment-model";

dayjs.extend(utc);
dayjs.extend(timezone);

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

  const startOfToday = dayjs().tz("Europe/Madrid").startOf("day").toDate();
  const newReviewsCountPromise = reviewLogsRepository.getReviewsOfNewCardsCount(
    {
      courseEnrollmentId,
      minDate: startOfToday,
    },
  );
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
  if (cards.length === 0) {
    return <PracticeEmptyState />;
  }
  return (
    <PracticeWizard
      courseData={course.data}
      cardsData={cards.map((c) => c.data)}
    />
  );
}
