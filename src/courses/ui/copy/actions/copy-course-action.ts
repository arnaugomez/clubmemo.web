"use server";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { coursesLocator } from "@/src/courses/courses-locator";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { revalidatePath, revalidateTag } from "next/cache";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";
import type { CopyCourseActionModel } from "../schemas/copy-course-action-schema";
import { CopyCourseActionSchema } from "../schemas/copy-course-action-schema";

export async function copyCourseAction(input: CopyCourseActionModel) {
  try {
    const parsed = CopyCourseActionSchema.parse(input);

    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();

    const useCase = await coursesLocator.CopyCourseUseCase();
    const course = await useCase.execute({
      courseId: parsed.courseId,
      profileId: profile.id,
    });

    revalidatePath("/courses");
    revalidatePath("/learn");
    revalidateTag("hasCourses");

    return ActionResponse.formSuccess(course.data);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
