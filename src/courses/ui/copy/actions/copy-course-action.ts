"use server";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { coursesLocator } from "@/src/courses/courses-locator";
import { revalidatePath } from "next/cache";
import type { CopyCourseActionModel } from "../schemas/copy-course-action-schema";
import { CopyCourseActionSchema } from "../schemas/copy-course-action-schema";

export async function copyCourseAction(input: CopyCourseActionModel) {
  try {
    const parsed = CopyCourseActionSchema.parse(input);

    const useCase = await coursesLocator.CopyCourseUseCase();
    const course = await useCase.execute(parsed.courseId);

    revalidatePath("/courses");
    revalidatePath("/learn");

    return ActionResponse.formSuccess(course.data);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
