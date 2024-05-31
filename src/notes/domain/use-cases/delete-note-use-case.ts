import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import type { CoursesRepository } from "@/src/courses/domain/interfaces/courses-repository";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import type { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import type { NotesRepository } from "../interfaces/notes-repository";
import { NoteDoesNotExistError } from "../models/notes-errors";

/**
 * Deletes a note permanently, removing it from the course. It
 * also deletes all the practice cards of that note.
 *
 * @input The input data to delete a note, including the note id
 */
export class DeleteNoteUseCase {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly coursesRepository: CoursesRepository,
    private readonly notesRepository: NotesRepository,
  ) {}

  async execute({ noteId }: DeleteNoteUseCaseInputModel): Promise<void> {
    const profile = await this.getMyProfileUseCase.execute();
    if (!profile) throw new ProfileDoesNotExistError();

    const note = await this.notesRepository.getDetail(noteId);
    if (!note) throw new NoteDoesNotExistError();

    const course = await this.coursesRepository.getDetail({
      id: note.courseId,
      profileId: profile.id,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (!course.canDelete) throw new NoPermissionError();

    await this.notesRepository.delete(noteId);
  }
}

interface DeleteNoteUseCaseInputModel {
  noteId: string;
}
