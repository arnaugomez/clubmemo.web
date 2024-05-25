import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import type { CoursesRepository } from "@/src/courses/domain/interfaces/courses-repository";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import type { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import type { PracticeCardsRepository } from "../interfaces/practice-cards-repository";
import type { ReviewLogsRepository } from "../interfaces/review-logs-repository";
import type { PracticeCardModel } from "../models/practice-card-model";
import type { ReviewLogModel } from "../models/review-log-model";

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
