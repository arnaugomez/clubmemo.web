import { NoPermissionError } from "@/src/core/common/domain/models/app-errors";
import { CoursesRepository } from "@/src/core/courses/domain/interfaces/courses-repository";
import { CourseDoesNotExistError } from "@/src/core/courses/domain/models/course-errors";
import { NotesRepository } from "../interfaces/notes-repository";
import { CreateNoteInputModel } from "../models/create-note-input-model";
import { NoteModel } from "../models/note-model";

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
