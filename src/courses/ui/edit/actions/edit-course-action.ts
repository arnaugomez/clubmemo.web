"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { coursesLocator } from "@/src/courses/courses-locator";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { revalidatePath } from "next/cache";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";
import {
  EditCourseActionSchema,
  type EditCourseActionModel,
} from "../schemas/edit-course-action-schema";

export async function editCourseAction(input: EditCourseActionModel) {
  try {
    const parsed = EditCourseActionSchema.parse(input);

    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();

    const updateCourseUseCase = await coursesLocator.UpdateCourseUseCase();
    await updateCourseUseCase.execute(parsed, profile);

    revalidatePath("/courses");
    revalidatePath("/learn");
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
