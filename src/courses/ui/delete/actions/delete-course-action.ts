"use server";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";

import { coursesLocator } from "@/src/courses/courses-locator";
import { revalidatePath, revalidateTag } from "next/cache";
import type { DeleteCourseActionModel } from "../schemas/delete-course-action-schema";
import { DeleteCourseActionSchema } from "../schemas/delete-course-action-schema";

export async function deleteCourseAction(input: DeleteCourseActionModel) {
  try {
    const { id } = DeleteCourseActionSchema.parse(input);
    const useCase = await coursesLocator.DeleteCourseUseCase();
    await useCase.execute(id);

    revalidatePath("/courses");
    revalidatePath("/learn");
    revalidateTag("hasCourses");
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
