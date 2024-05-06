"use server";

import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import { locator } from "@/src/common/locator";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { EnrollmentDoesNotExistError } from "@/src/courses/domain/models/enrollment-errors";
import { revalidatePath } from "next/cache";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";
import type {
  EditCourseConfigActionModel} from "../schema/edit-course-config-action-schema";
import {
  EditCourseConfigActionSchema,
} from "../schema/edit-course-config-action-schema";

export async function editCourseConfigAction(
  data: EditCourseConfigActionModel,
) {
  try {
    const profile = await fetchMyProfile();
    if (!profile) throw new NoPermissionError();
    const parsed = EditCourseConfigActionSchema.parse(data);
    const enrollmentsRepository = await locator.CourseEnrollmentsRepository();
    const enrollment = await enrollmentsRepository.get(parsed.enrollmentId);
    if (!enrollment) throw new EnrollmentDoesNotExistError();
    if (enrollment.profileId !== profile.id) throw new NoPermissionError();
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
