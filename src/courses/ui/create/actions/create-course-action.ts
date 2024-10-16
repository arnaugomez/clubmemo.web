"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { revalidatePath } from "next/cache";
import type { CreateCourseActionModel } from "../schemas/create-course-action-schema";
import { CreateCourseActionSchema } from "../schemas/create-course-action-schema";
import { locator_courses_CreateCourseUseCase } from "@/src/courses/locators/locator_create-course-use-case";

export async function createCourseAction(input: CreateCourseActionModel) {
  try {
    const parsed = CreateCourseActionSchema.parse(input);
    const useCase = locator_courses_CreateCourseUseCase();
    const course = await useCase.execute(parsed);

    revalidatePath("/courses");
    revalidatePath("/learn");

    return ActionResponse.formSuccess(course.data);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
