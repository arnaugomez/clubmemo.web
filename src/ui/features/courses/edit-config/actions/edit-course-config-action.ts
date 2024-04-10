"use server";

import { NoPermissionError } from "@/src/core/app/domain/models/app-errors";
import { locator } from "@/src/core/app/locator";
import { EnrollmentDoesNotExistError } from "@/src/core/courses/domain/models/enrollment-errors";
import { ActionResponse } from "@/src/ui/models/server-form-errors";
import { revalidatePath } from "next/cache";
import { fetchMyProfile } from "../../../profile/fetch/fetch-my-profile";
import {
  EditCourseConfigActionModel,
  EditCourseConfigActionSchema,
} from "../schema/edit-course-config-action-schema";

export async function editCourseConfigAction(
  data: EditCourseConfigActionModel,
) {
  try {
    const profile = await fetchMyProfile();
    if (!profile) return new NoPermissionError();
    const parsed = EditCourseConfigActionSchema.parse(data);
    const enrollmentsRepository = await locator.CourseEnrollmentsRepository();
    const enrollment = await enrollmentsRepository.get(parsed.enrollmentId);
    if (!enrollment) return new EnrollmentDoesNotExistError();
    if (enrollment.profileId !== profile.id) return new NoPermissionError();
    await enrollmentsRepository.updateConfig(parsed);
    revalidatePath(`/courses/detail`);
    return ActionResponse.formSuccess(null);
  } catch (e) {
    if (e instanceof NoPermissionError) {
      return ActionResponse.formGlobalError("noPermission");
    } else if (e instanceof EnrollmentDoesNotExistError) {
      return ActionResponse.formGlobalError("enrollmentDoesNotExist");
    }
    // TODO: report error
    console.error(e);
    return ActionResponse.formGlobalError("general");
  }
}
