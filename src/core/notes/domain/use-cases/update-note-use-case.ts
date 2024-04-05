import { NoPermissionError } from "@/src/core/app/domain/models/app-errors";
import { CoursesRepository } from "@/src/core/courses/domain/interfaces/courses-repository";
import { CourseDoesNotExistError } from "@/src/core/courses/domain/models/course-errors";
import { NotesRepository } from "../interfaces/notes-repository";
import { NoteDoesNotExistError } from "../models/notes-errors";
import { UpdateNoteInputModel } from "../models/update-note-input-model";

interface UpdateNoteUseCaseInputModel {
  profileId: string;
  updateNoteInput: UpdateNoteInputModel;
}

export class UpdateNoteUseCase {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly notesRepository: NotesRepository,
  ) {}

  async execute({
    profileId,
    updateNoteInput,
  }: UpdateNoteUseCaseInputModel): Promise<void> {
    const note = await this.notesRepository.getNote(updateNoteInput.id);
    if (!note) throw new NoteDoesNotExistError();

    const course = await this.coursesRepository.getDetail({
      id: note.courseId,
      profileId,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (!course.canEdit) throw new NoPermissionError();

    await this.notesRepository.updateNote(updateNoteInput);
  }
}
