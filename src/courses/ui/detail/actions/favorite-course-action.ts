"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { revalidatePath } from "next/cache";
import type { FavoriteCourseActionModel } from "../schemas/favorite-course-action-schema";
import { FavoriteCourseActionSchema } from "../schemas/favorite-course-action-schema";
import { locator_courses_FavoriteCourseUseCase } from "@/src/courses/locators/locator_favorite-course-use-case";

export async function favoriteCourseAction(input: FavoriteCourseActionModel) {
  try {
    const parsed = FavoriteCourseActionSchema.parse(input);
    const useCase = locator_courses_FavoriteCourseUseCase();
    await useCase.execute(parsed);

    revalidatePath("/courses");
    revalidatePath("/learn");
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
