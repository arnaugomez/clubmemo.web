"use server";

import { locator } from "@/src/common/locator";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { revalidatePath, revalidateTag } from "next/cache";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";
import type { CreateCourseActionModel } from "../schemas/create-course-action-schema";
import { CreateCourseActionSchema } from "../schemas/create-course-action-schema";

export async function createCourseAction(input: CreateCourseActionModel) {
  try {
    const { name } = CreateCourseActionSchema.parse(input);

    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();

    const coursesRepository = await locator.CoursesRepository();
    const course = await coursesRepository.create({
      name,
      profileId: profile.id,
    });

    revalidatePath("/courses");
    revalidatePath("/learn");
    revalidateTag("hasCourses");
    return ActionResponse.formSuccess(course.data);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
