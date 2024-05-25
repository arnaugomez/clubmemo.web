import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import type { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import type { CoursesRepository } from "../interfaces/courses-repository";
import {
  CannotDeleteCourseError,
  CourseDoesNotExistError,
} from "../models/course-errors";

export class DeleteCourseUseCase {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  async execute(courseId: string) {
    const profile = await this.getMyProfileUseCase.execute();
    if (!profile) throw new ProfileDoesNotExistError();

    const course = await this.coursesRepository.getDetail({
      id: courseId,
      profileId: profile.id,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (!course.canDelete) throw new CannotDeleteCourseError();
    await this.coursesRepository.delete(courseId);
  }
}
