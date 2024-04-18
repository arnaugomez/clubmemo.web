"use server";

import { PresignedUrlModelData } from "@/src/core/common/domain/models/presigned-url-model";
import { locator } from "@/src/core/common/locator";
import {
  CannotEditCourseError,
  CourseDoesNotExistError,
} from "@/src/core/courses/domain/models/course-errors";
import { ProfileDoesNotExistError } from "@/src/core/profile/domain/errors/profile-errors";
import {
  ActionResponse,
  FormActionResponse,
} from "@/src/ui/models/server-form-errors";
import { fetchMyProfile } from "../../../profile/fetch/fetch-my-profile";

interface EditCourseUploadActionData {
  courseId: string;
  pictureContentType: string;
  uploadPicture: boolean;
}

interface EditCourseUploadActionResult {
  picture?: PresignedUrlModelData;
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

    const uploadFileService = await locator.UploadFileService();

    const [picture] = await Promise.all([
      uploadPicture
        ? uploadFileService.generatePresignedUrl({
            key: `profile/picture/${profile.id}`,
            contentType: pictureContentType,
          })
        : null,
    ]);

    return ActionResponse.formSuccess({
      picture: picture?.data,
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
