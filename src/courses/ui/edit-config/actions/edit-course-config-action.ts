"use server";

import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import { locator } from "@/src/common/locator";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { EnrollmentDoesNotExistError } from "@/src/courses/domain/models/enrollment-errors";
import { revalidatePath } from "next/cache";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";
import type { EditCourseConfigActionModel } from "../schema/edit-course-config-action-schema";
import { EditCourseConfigActionSchema } from "../schema/edit-course-config-action-schema";

export async function editCourseConfigAction(
  data: EditCourseConfigActionModel,
) {
  try {
    const parsed = EditCourseConfigActionSchema.parse(data);

    const profile = await fetchMyProfile();
    if (!profile) throw new NoPermissionError();

    const enrollmentsRepository = await locator.CourseEnrollmentsRepository();
    const enrollment = await enrollmentsRepository.get(parsed.enrollmentId);

    if (!enrollment) throw new EnrollmentDoesNotExistError();
    if (enrollment.profileId !== profile.id) throw new NoPermissionError();

    await enrollmentsRepository.updateConfig(parsed);

    revalidatePath(`/courses/detail`);
    return ActionResponse.formSuccess(null);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
