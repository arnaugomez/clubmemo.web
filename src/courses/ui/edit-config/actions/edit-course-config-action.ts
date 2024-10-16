"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { revalidatePath } from "next/cache";
import type { EditCourseConfigActionModel } from "../schema/edit-course-config-action-schema";
import { EditCourseConfigActionSchema } from "../schema/edit-course-config-action-schema";
import { locator_courses_EditCourseConfigUseCase } from "@/src/courses/locators/locator_edit-course-config-use-case";

export async function editCourseConfigAction(
  data: EditCourseConfigActionModel,
) {
  try {
    const parsed = EditCourseConfigActionSchema.parse(data);

    const useCase = locator_courses_EditCourseConfigUseCase();
    await useCase.execute(parsed);

    revalidatePath(`/courses/detail`);
    return ActionResponse.formSuccess(null);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
