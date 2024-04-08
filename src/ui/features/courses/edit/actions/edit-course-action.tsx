"use server";

import { coursesLocator } from "@/src/core/courses/courses-locator";
import {
  CannotEditCourseError,
  CourseDoesNotExistError,
} from "@/src/core/courses/domain/models/course-errors";
import { UpdateCourseInputModel } from "@/src/core/courses/domain/models/update-course-input-model";
import { ProfileDoesNotExistError } from "@/src/core/profile/domain/errors/profile-errors";
import { ActionResponse } from "@/src/ui/models/server-form-errors";
import { revalidatePath } from "next/cache";
import { fetchMyProfile } from "../../../profile/fetch/fetch-my-profile";

export async function editCourseAction(data: UpdateCourseInputModel) {
  try {
    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();

    const updateCourseUseCase = await coursesLocator.UpdateCourseUseCase();
    await updateCourseUseCase.execute(data, profile);

    revalidatePath("/courses");
    revalidatePath("/learn");
  } catch (e) {
    if (e instanceof ProfileDoesNotExistError) {
      return ActionResponse.formGlobalError("profileDoesNotExist");
    } else if (e instanceof CourseDoesNotExistError) {
      return ActionResponse.formGlobalError("courseDoesNotExist");
    } else if (e instanceof CannotEditCourseError) {
      return ActionResponse.formGlobalError("cannotEditCourse");
    } else {
      // TODO: log error report
      console.error(e);
      return ActionResponse.formGlobalError("general");
    }
  }
}
