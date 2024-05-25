import type { FileUploadsRepository } from "@/src/file-upload/domain/interfaces/file-uploads-repository";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import type { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import type { TagsRepository } from "@/src/tags/domain/interfaces/tags-repository";
import type { CoursesRepository } from "../interfaces/courses-repository";
import {
  CannotEditCourseError,
  CourseDoesNotExistError,
} from "../models/course-errors";
import type { UpdateCourseInputModel } from "../models/update-course-input-model";

export class EditCourseUseCase {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly tagsRepository: TagsRepository,
    private readonly coursesRepository: CoursesRepository,
    private readonly fileUploadsRepository: FileUploadsRepository,
  ) {}

  async execute(input: UpdateCourseInputModel): Promise<void> {
    const profile = await this.getMyProfileUseCase.execute();
    if (!profile) throw new ProfileDoesNotExistError();

    const course = await this.coursesRepository.getDetail({
      id: input.id,
      profileId: profile.id,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (!course.canEdit) throw new CannotEditCourseError();

    if (input.picture && input.picture !== course.picture) {
      await this.fileUploadsRepository.setCurrent(input.picture);
    }

    await Promise.all([
      this.tagsRepository.create(input.tags),
      this.coursesRepository.update(input),
    ]);
  }
}
