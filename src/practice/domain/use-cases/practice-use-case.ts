import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import type { CoursesRepository } from "@/src/courses/domain/interfaces/courses-repository";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import type { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import type { PracticeCardsRepository } from "../interfaces/practice-cards-repository";
import type { ReviewLogsRepository } from "../interfaces/review-logs-repository";
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
export class PracticeUseCase {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly coursesRepository: CoursesRepository,
    private readonly cardsRepository: PracticeCardsRepository,
    private readonly reviewLogsRepository: ReviewLogsRepository,
  ) {}

  async execute({
    card,
    courseId,
    reviewLog,
  }: PracticeInputModel): Promise<PracticeOutputModel> {
    const profile = await this.getMyProfileUseCase.execute();
    if (!profile) throw new ProfileDoesNotExistError();

    const course = await this.coursesRepository.getDetail({
      id: courseId,
      profileId: profile.id,
    });

    if (!course) throw new CourseDoesNotExistError();
    if (
      !course.canView ||
      !course.isEnrolled ||
      course.enrollment?.id !== card.courseEnrollmentId
    ) {
      throw new NoPermissionError();
    }

    // Create a new card or update it if it already exists
    const newCard =
      (await (card.isNew
        ? this.cardsRepository.create(card)
        : this.cardsRepository.update(card))) ?? card;

    reviewLog.data.cardId = newCard.id;
    const newReviewLog = await this.reviewLogsRepository.create(reviewLog);

    return { newCard, newReviewLog };
  }
}

interface PracticeInputModel {
  courseId: string;
  card: PracticeCardModel;
  reviewLog: ReviewLogModel;
}

interface PracticeOutputModel {
  newCard: PracticeCardModel;
  newReviewLog: ReviewLogModel;
}
