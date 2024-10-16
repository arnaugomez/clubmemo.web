"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { revalidatePath } from "next/cache";
import {
  EditCourseActionSchema,
  type EditCourseActionModel,
} from "../schemas/edit-course-action-schema";
import { locator_courses_EditCourseUseCase } from "@/src/courses/locators/locator_edit-course-use-case";

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
