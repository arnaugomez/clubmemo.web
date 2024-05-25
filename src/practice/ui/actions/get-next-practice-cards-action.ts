"use server";

import { locator } from "@/src/common/locator";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { fetchMyProfile } from "../../../profile/ui/fetch/fetch-my-profile";
import { fetchPracticeCards } from "../fetch/fetch-practice-cards";
import type { GetNextPracticeCardsActionModel } from "../schemas/get-next-practice-cards-action-schema";
import { GetNextPracticeCardsActionSchema } from "../schemas/get-next-practice-cards-action-schema";

export async function getNextPracticeCardsAction(
  input: GetNextPracticeCardsActionModel,
) {
  try {
    const parsed = GetNextPracticeCardsActionSchema.parse(input);

    const profile = await fetchMyProfile();
    if (!profile) return ActionResponse.formSuccess([]);

    const coursesRepository = await locator.CoursesRepository();
    const course = await coursesRepository.getDetail({
      id: parsed.courseId,
      profileId: profile.id,
    });
    if (!course?.enrollment) return ActionResponse.formSuccess([]);

    const cards = await fetchPracticeCards({
      course,
      enrollment: course.enrollment,
    });
    return ActionResponse.formSuccess(cards.map((c) => c.data));
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
