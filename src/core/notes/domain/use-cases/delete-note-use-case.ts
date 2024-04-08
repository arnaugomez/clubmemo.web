import { NoPermissionError } from "@/src/core/app/domain/models/app-errors";
import { CoursesRepository } from "@/src/core/courses/domain/interfaces/courses-repository";
import { CourseDoesNotExistError } from "@/src/core/courses/domain/models/course-errors";
import { NotesRepository } from "../interfaces/notes-repository";
import { NoteDoesNotExistError } from "../models/notes-errors";

interface DeleteNoteUseCaseInputModel {
  profileId: string;
  noteId: string;
}

export class DeleteNoteUseCase {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly notesRepository: NotesRepository,
  ) {}

  async execute({
    profileId,
    noteId,
  }: DeleteNoteUseCaseInputModel): Promise<void> {
    const note = await this.notesRepository.getDetail(noteId);
    if (!note) throw new NoteDoesNotExistError();

    const course = await this.coursesRepository.getDetail({
      id: note.courseId,
      profileId,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (!course.canDelete) throw new NoPermissionError();

    await this.notesRepository.delete(noteId);
  }
}
