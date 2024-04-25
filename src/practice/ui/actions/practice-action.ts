"use server";

import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import { locator } from "@/src/common/locator";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import {
  PracticeCardModel,
  PracticeCardModelData,
} from "@/src/practice/domain/models/practice-card-model";
import {
  ReviewLogModel,
  ReviewLogModelData,
} from "@/src/practice/domain/models/review-log-model";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { fetchMyProfile } from "../../../profile/ui/fetch/fetch-my-profile";

interface PracticeActionModel {
  courseId: string;
  card: PracticeCardModelData;
  reviewLog: ReviewLogModelData;
}

export async function practiceAction(params: PracticeActionModel) {
  try {
    const card = new PracticeCardModel(params.card);
    const reviewLog = new ReviewLogModel(params.reviewLog);
    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();
    const coursesRepository = await locator.CoursesRepository();
    const course = await coursesRepository.getDetail({
      id: params.courseId,
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
    const cardsRepository = await locator.PracticeCardsRepository();
    const reviewLogsRepository = await locator.ReviewLogsRepository();

    const newCard =
      (await (card.isNew
        ? cardsRepository.create(card)
        : cardsRepository.update(card))) ?? card;
    reviewLog.data.cardId = newCard.id;
    const newReviewLog = await reviewLogsRepository.create(reviewLog);
    return ActionResponse.formSuccess({
      card: newCard.data,
      reviewLog: newReviewLog.data,
    });
  } catch (error) {
    // TODO: Log error
    console.error(error);
    return ActionResponse.formGlobalError("general");
  }
}
