import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import type { CoursesRepository } from "@/src/courses/domain/interfaces/courses-repository";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import type { NotesRepository } from "../interfaces/notes-repository";
import type { NoteModel } from "../models/note-model";
import { NoteDoesNotExistError } from "../models/notes-errors";
import type { UpdateNoteInputModel } from "../models/update-note-input-model";

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
  }: UpdateNoteUseCaseInputModel): Promise<NoteModel | null> {
    const note = await this.notesRepository.getDetail(updateNoteInput.id);
    if (!note) throw new NoteDoesNotExistError();

    const course = await this.coursesRepository.getDetail({
      id: note.courseId,
      profileId,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (!course.canEdit) throw new NoPermissionError();

    await this.notesRepository.update(updateNoteInput);
    return await this.notesRepository.getDetail(updateNoteInput.id);
  }
}
