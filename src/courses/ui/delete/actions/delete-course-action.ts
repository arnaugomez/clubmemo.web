"use server";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";

import { revalidatePath } from "next/cache";
import type { DeleteCourseActionModel } from "../schemas/delete-course-action-schema";
import { DeleteCourseActionSchema } from "../schemas/delete-course-action-schema";
import { locator_courses_DeleteCourseUseCase } from "@/src/courses/locators/locator_delete-course-use-case";

export async function deleteCourseAction(input: DeleteCourseActionModel) {
  try {
    const { id } = DeleteCourseActionSchema.parse(input);
    const useCase = locator_courses_DeleteCourseUseCase();
    await useCase.execute(id);

    revalidatePath("/courses");
    revalidatePath("/learn");
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
