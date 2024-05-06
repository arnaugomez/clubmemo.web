import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import type { CoursesRepository } from "@/src/courses/domain/interfaces/courses-repository";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import type { NotesRepository } from "../interfaces/notes-repository";
import type { CreateNoteInputModel } from "../models/create-note-input-model";
import type { NoteModel } from "../models/note-model";

interface CreateNoteUseCaseInputModel {
  profileId: string;
  createNoteInput: CreateNoteInputModel;
}

export class CreateNoteUseCase {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly notesRepository: NotesRepository,
  ) {}

  async execute({
    profileId,
    createNoteInput,
  }: CreateNoteUseCaseInputModel): Promise<NoteModel> {
    const course = await this.coursesRepository.getDetail({
      id: createNoteInput.courseId,
      profileId,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (!course.canEdit) throw new NoPermissionError();

    return await this.notesRepository.create(createNoteInput);
  }
}
