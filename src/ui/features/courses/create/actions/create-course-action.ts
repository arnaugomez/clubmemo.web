"use server";

import { locator } from "@/src/core/app/locator";
import { ProfileDoesNotExistError } from "@/src/core/profile/domain/errors/profile-errors";
import { ActionResponse } from "@/src/ui/models/server-form-errors";
import { revalidatePath, revalidateTag } from "next/cache";
import { fetchMyProfile } from "../../../profile/fetch/fetch-my-profile";

interface CreateCourseActionModel {
  name: string;
}

export async function createCourseAction(data: CreateCourseActionModel) {
  try {
    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();
    const coursesRepository = await locator.CoursesRepository();
    const course = await coursesRepository.create({
      name: data.name,
      profileId: profile.id,
    });
    revalidatePath("/courses");
    revalidatePath("/learn");
    revalidateTag("hasCourses");
    return ActionResponse.formSuccess(course.data);
  } catch (e) {
    // TODO: log error report
    console.error(e);
    return ActionResponse.formGlobalError("general");
  }
}
