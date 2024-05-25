"use server";
import { locator } from "@/src/common/locator";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import {
  CannotDeleteCourseError,
  CourseDoesNotExistError,
} from "@/src/courses/domain/models/course-errors";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { revalidatePath, revalidateTag } from "next/cache";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";
import type { DeleteCourseActionModel } from "../schemas/delete-course-action-schema";
import { DeleteCourseActionSchema } from "../schemas/delete-course-action-schema";

export async function deleteCourseAction(input: DeleteCourseActionModel) {
  try {
    const { id } = DeleteCourseActionSchema.parse(input);
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
    return ActionErrorHandler.handle(e);
  }
}
