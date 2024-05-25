import type { FileUploadsRepository } from "@/src/file-upload/domain/interfaces/file-uploads-repository";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import type { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import type { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";
import type { CoursesRepository } from "../interfaces/courses-repository";
import {
  CannotEditCourseError,
  CourseDoesNotExistError,
} from "../models/course-errors";

export class EditCourseUploadUseCase {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly rateLimitsRepository: RateLimitsRepository,
    private readonly coursesRepository: CoursesRepository,
    private readonly fileUploadsRepository: FileUploadsRepository,
  ) {}

  async execute({
    courseId,
    uploadPicture,
    pictureContentType,
  }: UpdateCourseInputModel) {
    if (!uploadPicture) return;
    const profile = await this.getMyProfileUseCase.execute();
    if (!profile) throw new ProfileDoesNotExistError();

    const rateLimitKey = `EditCourseUploadUseCase/${profile.id}`;
    await this.rateLimitsRepository.check(rateLimitKey, 40);

    const course = await this.coursesRepository.getDetail({
      id: courseId,
      profileId: profile.id,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (course.canEdit === false) throw new CannotEditCourseError();

    const picture = await this.fileUploadsRepository.create({
      keyPrefix: `profile/picture/${profile.id}`,
      fileName: "profile-picture",
      contentType: pictureContentType,
    });
    await this.rateLimitsRepository.increment(rateLimitKey);
    return picture;
  }
}

interface UpdateCourseInputModel {
  courseId: string;
  pictureContentType: string;
  uploadPicture: boolean;
}
