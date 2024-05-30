"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { coursesLocator } from "@/src/courses/courses-locator";
import { revalidatePath, revalidateTag } from "next/cache";
import type { CreateCourseActionModel } from "../schemas/create-course-action-schema";
import { CreateCourseActionSchema } from "../schemas/create-course-action-schema";

export async function createCourseAction(input: CreateCourseActionModel) {
  try {
    const parsed = CreateCourseActionSchema.parse(input);
    const useCase = await coursesLocator.CreateCourseUseCase();
    const course = await useCase.execute(parsed);

    revalidatePath("/courses");
    revalidatePath("/learn");
    revalidateTag("hasCourses");
    return ActionResponse.formSuccess(course.data);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
