import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import type { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import type { CoursesRepository } from "../interfaces/courses-repository";
import {
  CannotDeleteCourseError,
  CourseDoesNotExistError,
} from "../models/course-errors";

/**
 * Deletes a course permanently
 *
 * @param courseId The id of the course to delete
 * @throws {ProfileDoesNotExistError} When the user is not logged in
 * @throws {CourseDoesNotExistError} When the course does not exist
 * @throws {CannotDeleteCourseError} When the course cannot be deleted because
 * the profile does not have permission to do so
 */
export class DeleteCourseUseCase {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  /**
   * Deletes a course permanently. Also deletes
   * - Enrollments
   * - Permissions
   *
   * @param courseId The id of the course to delete
   * @throws {ProfileDoesNotExistError} When the user is not logged in
   * @throws {CourseDoesNotExistError} When the course does not exist
   * @throws {CannotDeleteCourseError} When the course cannot be deleted because
   * the profile does not have permission to do so
   */
  async execute(courseId: string): Promise<void> {
    const profile = await this.getMyProfileUseCase.execute();
    if (!profile) throw new ProfileDoesNotExistError();

    const course = await this.coursesRepository.getDetail({
      id: courseId,
      profileId: profile.id,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (!course.canDelete) throw new CannotDeleteCourseError();
    await this.coursesRepository.delete(courseId);
    // TODO: Delete course notes, cards and other related data
  }
}
