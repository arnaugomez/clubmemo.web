"use server";

import { locator } from "@/src/common/locator";
import { fetchMyProfile } from "../../../profile/ui/fetch/fetch-my-profile";
import { fetchPracticeCards } from "../fetch/fetch-practice-cards";

interface GetNextPracticeCardsActionModel {
  courseId: string;
}

export async function getNextPracticeCardsAction(
  params: GetNextPracticeCardsActionModel,
) {
  const profile = await fetchMyProfile();
  if (!profile) return [];
  const coursesRepository = await locator.CoursesRepository();
  const course = await coursesRepository.getDetail({
    id: params.courseId,
    profileId: profile?.id,
  });
  if (!course?.enrollment) return [];

  const cards = await fetchPracticeCards({
    course,
    enrollment: course.enrollment,
  });
  return cards.map((c) => c.data);
}
