"use server";
import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { coursesLocator } from "@/src/courses/courses-locator";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { revalidatePath, revalidateTag } from "next/cache";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";
import {
  CopyCourseActionModel,
  CopyCourseActionSchema,
} from "../schemas/copy-course-action-schema";

export async function copyCourseAction(data: CopyCourseActionModel) {
  try {
    const parsed = CopyCourseActionSchema.parse(data);
    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();
    const useCase = await coursesLocator.CopyCourseUseCase();
    const course = await useCase.execute({
      courseId: parsed.courseId,
      profileId: profile.id,
    });
    revalidatePath("/courses");
    revalidatePath("/learn");
    revalidateTag("hasCourses");

    return ActionResponse.formSuccess(course.data);
  } catch (e) {
    if (e instanceof ProfileDoesNotExistError) {
      return ActionResponse.formGlobalError("profileDoesNotExist");
    } else if (e instanceof CourseDoesNotExistError) {
      return ActionResponse.formGlobalError("courseDoesNotExist");
    } else if (e instanceof NoPermissionError) {
      return ActionResponse.formGlobalError("noPermission");
    } else {
      // TODO: log error
      console.error(e);
      return ActionResponse.formGlobalError("general");
    }
  }
}
