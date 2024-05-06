import type { ProfileModel } from "@/src/profile/domain/models/profile-model";
import type { TagsRepository } from "@/src/tags/domain/interfaces/tags-repository";
import type { CoursesRepository } from "../interfaces/courses-repository";
import {
  CannotEditCourseError,
  CourseDoesNotExistError,
} from "../models/course-errors";
import type { UpdateCourseInputModel } from "../models/update-course-input-model";

export class UpdateCourseUseCase {
  constructor(
    private readonly tagsRepository: TagsRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  async execute(
    input: UpdateCourseInputModel,
    profile: ProfileModel,
  ): Promise<void> {
    const course = await this.coursesRepository.getDetail({
      id: input.id,
      profileId: profile.id,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (!course.canEdit) throw new CannotEditCourseError();

    await Promise.all([
      this.tagsRepository.create(input.tags),
      this.coursesRepository.update(input),
    ]);
  }
}
