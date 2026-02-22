"use server";

import { revalidatePath } from "next/cache";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { locator_courses_EditCourseUseCase } from "@/src/courses/locators/locator_edit-course-use-case";
import {
  type EditCourseActionModel,
  EditCourseActionSchema,
} from "../schemas/edit-course-action-schema";

export async function editCourseAction(input: EditCourseActionModel) {
  try {
    const parsed = EditCourseActionSchema.parse(input);

    const useCase = locator_courses_EditCourseUseCase();
    await useCase.execute(parsed);

    revalidatePath("/courses");
    revalidatePath("/learn");
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
