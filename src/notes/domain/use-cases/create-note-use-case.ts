import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import type { CoursesRepository } from "@/src/courses/domain/interfaces/courses-repository";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import type { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import type { NotesRepository } from "../interfaces/notes-repository";
import type { CreateNoteInputModel } from "../models/create-note-input-model";
import type { NoteModel } from "../models/note-model";

/**
 * Creates a new note for a course
 *
 * @input The input data to create a note, including the course id, and the note content
 * @returns The created note
 *
 * @throws {ProfileDoesNotExistError} When the user is not logged in
 * @throws {CourseDoesNotExistError} When the course does not exist
 */
export class CreateNoteUseCase {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly coursesRepository: CoursesRepository,
    private readonly notesRepository: NotesRepository,
  ) {}

  /**
   * Creates a new note for a course
   *
   * @input The input data to create a note, including the course id, and the
   * note content
   * @returns The created note
   *
   * @throws {ProfileDoesNotExistError} When the user is not logged in
   * @throws {CourseDoesNotExistError} When the course does not exist
   */
  async execute(input: CreateNoteInputModel): Promise<NoteModel> {
    const profile = await this.getMyProfileUseCase.execute();
    if (!profile) throw new ProfileDoesNotExistError();

    const course = await this.coursesRepository.getDetail({
      id: input.courseId,
      profileId: profile.id,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (!course.canEdit) throw new NoPermissionError();

    return await this.notesRepository.create(input);
  }
}
