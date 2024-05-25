"use server";

import { locator } from "@/src/common/locator";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import type { FormActionResponse } from "@/src/common/ui/models/server-form-errors";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import {
  CannotEditCourseError,
  CourseDoesNotExistError,
} from "@/src/courses/domain/models/course-errors";
import type { CreateFileUploadOutputModel } from "@/src/file-upload/domain/interfaces/file-uploads-repository";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";
import type { EditCourseUploadActionModel } from "../schemas/edit-course-upload-action-schema";
import { EditCourseUploadActionSchema } from "../schemas/edit-course-upload-action-schema";

interface EditCourseUploadActionResult {
  picture?: CreateFileUploadOutputModel;
}

export async function editCourseUploadAction(
  input: EditCourseUploadActionModel,
): Promise<FormActionResponse<EditCourseUploadActionResult | null>> {
  try {
    const { courseId, uploadPicture, pictureContentType } =
      EditCourseUploadActionSchema.parse(input);

    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();

    const rateLimitKey = `editCourseUploadAction/${profile.id}`;
    const rateLimitsRepository = locator.RateLimitsRepository();
    if (uploadPicture) {
      await rateLimitsRepository.check(rateLimitKey, 40);
      await rateLimitsRepository.increment(rateLimitKey);
    }

    const coursesRepository = await locator.CoursesRepository();
    const course = await coursesRepository.getDetail({
      id: courseId,
      profileId: profile.id,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (course.canEdit === false) throw new CannotEditCourseError();

    const fileUploadsRepository = await locator.FileUploadsRepository();

    const picture = uploadPicture
      ? await fileUploadsRepository.create({
          keyPrefix: `profile/picture/${profile.id}`,
          fileName: "profile-picture",
          contentType: pictureContentType,
        })
      : undefined;

    return ActionResponse.formSuccess({
      picture,
    });
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
