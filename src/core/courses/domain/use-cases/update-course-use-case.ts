import { TagsRepository } from "@/src/core/tags/domain/interfaces/tags-repository";
import { CoursesRepository } from "../interfaces/courses-repository";
import { UpdateCourseInputModel } from "../models/update-course-input-model";
import { ProfileModel } from "@/src/core/profile/domain/models/profile-model";
import {
  CannotEditCourseError,
  CourseDoesNotExistError,
} from "../errors/course-errors";

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
