"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { coursesLocator } from "@/src/courses/courses-locator";
import { revalidatePath } from "next/cache";
import type { EditCourseConfigActionModel } from "../schema/edit-course-config-action-schema";
import { EditCourseConfigActionSchema } from "../schema/edit-course-config-action-schema";

export async function editCourseConfigAction(
  data: EditCourseConfigActionModel,
) {
  try {
    const parsed = EditCourseConfigActionSchema.parse(data);

    const useCase = await coursesLocator.EditCourseConfigUseCase();
    await useCase.execute(parsed);

    revalidatePath(`/courses/detail`);
    return ActionResponse.formSuccess(null);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
