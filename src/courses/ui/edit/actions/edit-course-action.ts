"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { coursesLocator } from "@/src/courses/courses-locator";
import { revalidatePath } from "next/cache";
import {
  EditCourseActionSchema,
  type EditCourseActionModel,
} from "../schemas/edit-course-action-schema";

export async function editCourseAction(input: EditCourseActionModel) {
  try {
    const parsed = EditCourseActionSchema.parse(input);

    const useCase = await coursesLocator.EditCourseUseCase();
    await useCase.execute(parsed);

    revalidatePath("/courses");
    revalidatePath("/learn");
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
