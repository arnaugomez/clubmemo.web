import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import type { NotesRepository } from "@/src/notes/domain/interfaces/notes-repository";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import type { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import type { CoursesRepository } from "../interfaces/courses-repository";
import { CourseDoesNotExistError } from "../models/course-errors";
import type { CourseModel } from "../models/course-model";

/**
 * Creates a copy of a course and assigns it to the profile of the current user (the one
 * that is logged in).
 *
 * Not only is the data of the course copied, but also the notes that belong to the course.
 * The new course and notes are independent from the original ones, so changes in the original
 * course or notes do not affect the new ones.
 *
 * @throws {ProfileDoesNotExistError} When the user is not logged in
 * @throws {CourseDoesNotExistError} When the course does not exist
 * @throws {NoPermissionError} When the user does not have permission to view the course
 */
export class CopyCourseUseCase {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly notesRepository: NotesRepository,
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
  ) {}

  /**
   * Creates a copy of a course and assigns it to the profile of the current user (the one
   * that is logged in).
   *
   * Not only is the data of the course copied, but also the notes that belong to the course.
   * The new course and notes are independent from the original ones, so changes in the original
   * course or notes do not affect the new ones.
   *
   * @param courseId The id of the course to copy
   * @returns The new course that was created
   * @throws {ProfileDoesNotExistError} When the user is not logged in
   * @throws {CourseDoesNotExistError} When the course does not exist
   * @throws {NoPermissionError} When the user does not have permission to view the course
   */
  async execute(courseId: string): Promise<CourseModel> {
    const profile = await this.getMyProfileUseCase.execute();
    if (!profile) throw new ProfileDoesNotExistError();
    const profileId = profile.id;

    const course = await this.coursesRepository.getDetail({
      id: courseId,
      profileId,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (!course.canView) throw new NoPermissionError();
    const newCourse = await this.coursesRepository.create({
      name: course.name + " (Copia)",
      profileId,
    });

    await Promise.all([
      this.coursesRepository.update({
        id: newCourse.id,
        name: newCourse.name,
        isPublic: false,
        description: course.description ?? "",
        tags: course.tags,
        picture: course.picture,
      }),
      this.notesRepository.copy({
        sourceCourseId: courseId,
        targetCourseId: newCourse.id,
      }),
    ]);

    return newCourse;
  }
}
