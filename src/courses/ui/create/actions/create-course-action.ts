"use server";

import { locator } from "@/src/common/locator";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { revalidatePath, revalidateTag } from "next/cache";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";

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
