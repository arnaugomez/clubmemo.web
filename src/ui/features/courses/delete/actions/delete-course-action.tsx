"use server";
import { locator } from "@/src/core/app/locator";
import {
  CannotDeleteCourseError,
  CourseDoesNotExistError,
} from "@/src/core/courses/domain/errors/course-errors";
import { ProfileDoesNotExistError } from "@/src/core/profile/domain/errors/profile-errors";
import { ActionResponse } from "@/src/ui/view-models/server-form-errors";
import { fetchMyProfile } from "../../../profile/fetch/fetch-my-profile";
import { revalidatePath } from "next/cache";

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
