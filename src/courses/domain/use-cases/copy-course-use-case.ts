import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import type { NotesRepository } from "@/src/notes/domain/interfaces/notes-repository";
import type { CoursesRepository } from "../interfaces/courses-repository";
import type { CopyCourseInputModel } from "../models/copy-course-input-model";
import { CourseDoesNotExistError } from "../models/course-errors";
import type { CourseModel } from "../models/course-model";

export class CopyCourseUseCase {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly notesRepository: NotesRepository,
  ) {}

  async execute({
    courseId,
    profileId,
  }: CopyCourseInputModel): Promise<CourseModel> {
    const course = await this.coursesRepository.getDetail({
      id: courseId,
      profileId,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (!course.canView) throw new NoPermissionError();
    const newCourse = await this.coursesRepository.create({
      name: course.name + " (Copy)",
      profileId,
    });

    await Promise.all([
      this.coursesRepository.update({
        id: newCourse.id,
        name: newCourse.name,
        isPublic: false,
        description: course.description ?? "",
        tags: course.tags,
      }),
      this.notesRepository.copy({
        sourceCourseId: courseId,
        targetCourseId: newCourse.id,
      }),
    ]);

    return newCourse;
  }
}
