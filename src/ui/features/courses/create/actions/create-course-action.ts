"use server";

import { locator } from "@/src/core/app/locator";
import { ProfileDoesNotExistError } from "@/src/core/profile/domain/errors/profile-errors";
import { ActionResponse } from "@/src/ui/view-models/server-form-errors";
import { fetchMyProfile } from "../../../profile/fetch/fetch-my-profile";

interface CreateCourseActionData {
  name: string;
}

export async function createCourseAction(data: CreateCourseActionData) {
  try {
    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();
    const coursesRepository = await locator.CoursesRepository();
    const course = await coursesRepository.create({
      name: data.name,
      profileId: profile.id,
    });
    return ActionResponse.formSuccess(course.data);
  } catch (e) {
    // TODO: log error report
    console.error(e);
    return ActionResponse.formGlobalError("general");
  }
}
