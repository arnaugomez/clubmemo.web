import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import type { CoursesRepository } from "@/src/courses/domain/interfaces/courses-repository";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import type { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import type { NotesRepository } from "../interfaces/notes-repository";
import type { NoteModel } from "../models/note-model";
import { NoteDoesNotExistError } from "../models/notes-errors";
import type { UpdateNoteInputModel } from "../models/update-note-input-model";

export class UpdateNoteUseCase {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly coursesRepository: CoursesRepository,
    private readonly notesRepository: NotesRepository,
  ) {}

  async execute(input: UpdateNoteInputModel): Promise<NoteModel | null> {
    const profile = await this.getMyProfileUseCase.execute();
    if (!profile) throw new ProfileDoesNotExistError();

    const note = await this.notesRepository.getDetail(input.id);
    if (!note) throw new NoteDoesNotExistError();

    const course = await this.coursesRepository.getDetail({
      id: note.courseId,
      profileId: profile.id,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (!course.canEdit) throw new NoPermissionError();

    await this.notesRepository.update(input);
    return await this.notesRepository.getDetail(input.id);
  }
}
