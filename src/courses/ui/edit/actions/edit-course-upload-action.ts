"use server";

import { locator } from "@/src/common/locator";
import type { FormActionResponse } from "@/src/common/ui/models/server-form-errors";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import {
  CannotEditCourseError,
  CourseDoesNotExistError,
} from "@/src/courses/domain/models/course-errors";
import type { PresignedUrlModel } from "@/src/file-upload/domain/models/presigned-url-model";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";

interface EditCourseUploadActionData {
  courseId: string;
  pictureContentType: string;
  uploadPicture: boolean;
}

interface EditCourseUploadActionResult {
  picture?: PresignedUrlModel;
}

export async function editCourseUploadAction({
  courseId,
  pictureContentType,
  uploadPicture,
}: EditCourseUploadActionData): Promise<
  FormActionResponse<EditCourseUploadActionResult | null>
> {
  try {
    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();
    const coursesRepository = await locator.CoursesRepository();
    const course = await coursesRepository.getDetail({
      id: courseId,
      profileId: profile.id,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (course.canEdit === false) throw new CannotEditCourseError();

    const fileUploadService = await locator.FileUploadService();

    const [picture] = await Promise.all([
      uploadPicture
        ? fileUploadService.generatePresignedUrl({
            key: `profile/picture/${profile.id}`,
            contentType: pictureContentType,
          })
        : undefined,
    ]);

    return ActionResponse.formSuccess({
      picture,
    });
  } catch (e) {
    if (e instanceof ProfileDoesNotExistError) {
      return ActionResponse.formGlobalError("profileDoesNotExist");
    } else if (e instanceof CourseDoesNotExistError) {
      return ActionResponse.formGlobalError("courseDoesNotExist");
    } else if (e instanceof CannotEditCourseError) {
      return ActionResponse.formGlobalError("cannotEditCourse");
    } else {
      // TODO: log error report
      console.error(e);
      return ActionResponse.formGlobalError("general");
    }
  }
}
