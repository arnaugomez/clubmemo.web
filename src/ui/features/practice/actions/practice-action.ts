"use server";

import { NoPermissionError } from "@/src/core/common/domain/models/app-errors";
import { locator } from "@/src/core/common/locator";
import { CourseDoesNotExistError } from "@/src/core/courses/domain/models/course-errors";
import {
  PracticeCardModel,
  PracticeCardModelData,
} from "@/src/core/practice/domain/models/practice-card-model";
import {
  ReviewLogModel,
  ReviewLogModelData,
} from "@/src/core/practice/domain/models/review-log-model";
import { ProfileDoesNotExistError } from "@/src/core/profile/domain/errors/profile-errors";
import { ActionResponse } from "@/src/ui/models/server-form-errors";
import { fetchMyProfile } from "../../profile/fetch/fetch-my-profile";

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
      (await cardsRepository[card.isNew ? "create" : "update"](card)) ?? card;
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
