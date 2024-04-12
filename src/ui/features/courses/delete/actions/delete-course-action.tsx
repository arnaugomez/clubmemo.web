"use server";
import { locator } from "@/src/core/common/locator";
import {
  CannotDeleteCourseError,
  CourseDoesNotExistError,
} from "@/src/core/courses/domain/models/course-errors";
import { ProfileDoesNotExistError } from "@/src/core/profile/domain/errors/profile-errors";
import { ActionResponse } from "@/src/ui/models/server-form-errors";
import { revalidatePath, revalidateTag } from "next/cache";
import { fetchMyProfile } from "../../../profile/fetch/fetch-my-profile";

export async function deleteCourseAction(id: string) {
  try {
    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();
    const coursesRepository = await locator.CoursesRepository();
    const course = await coursesRepository.getDetail({
      id,
      profileId: profile.id,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (!course.canDelete) throw new CannotDeleteCourseError();
    await coursesRepository.delete(id);

    revalidatePath("/courses");
    revalidatePath("/learn");
    revalidateTag("hasCourses");
  } catch (e) {
    if (e instanceof ProfileDoesNotExistError) {
      return ActionResponse.formGlobalError("profileDoesNotExist");
    } else if (e instanceof CourseDoesNotExistError) {
      return ActionResponse.formGlobalError("courseDoesNotExist");
    } else if (e instanceof CannotDeleteCourseError) {
      return ActionResponse.formGlobalError("cannotDeleteCourse");
    } else {
      // TODO: log error
      console.error(e);
      return ActionResponse.formGlobalError("general");
    }
  }
}
