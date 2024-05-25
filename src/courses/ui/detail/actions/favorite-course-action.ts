"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { coursesLocator } from "@/src/courses/courses-locator";
import { revalidatePath } from "next/cache";
import type { FavoriteCourseActionModel } from "../schemas/favorite-course-action-schema";
import { FavoriteCourseActionSchema } from "../schemas/favorite-course-action-schema";

export async function favoriteCourseAction(input: FavoriteCourseActionModel) {
  try {
    const parsed = FavoriteCourseActionSchema.parse(input);
    const useCase = await coursesLocator.FavoriteCourseUseCase();
    await useCase.execute(parsed);

    revalidatePath("/courses");
    revalidatePath("/learn");
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
