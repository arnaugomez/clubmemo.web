import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import type { CoursesRepository } from "@/src/courses/domain/interfaces/courses-repository";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import type { NotesRepository } from "@/src/notes/domain/interfaces/notes-repository";
import type { NoteRowModel } from "@/src/notes/domain/models/note-row-model";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import type { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";

/**
 * Saves the AI-generated notes permanently and adds them to
 * the course, so that the user can practice them later.
 */
export class GenerateAiNotesConfirmUseCase {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly coursesRepository: CoursesRepository,
    private readonly notesRepository: NotesRepository,
  ) {}

  async execute(input: GenerateAiNotesConfirmInputModel) {
    const profile = await this.getMyProfileUseCase.execute();
    if (!profile) throw new ProfileDoesNotExistError();

    const course = await this.coursesRepository.getDetail({
      id: input.courseId,
      profileId: profile.id,
    });
    if (!course) throw new CourseDoesNotExistError();
    // Before adding the notes, check that the profile has permission to do so
    if (!course.canEdit) throw new NoPermissionError();

    await this.notesRepository.createMany(input.courseId, input.notes);
  }
}

interface GenerateAiNotesConfirmInputModel {
  /**
   * The ID of the course where the notes will be added
   */
  courseId: string;
  /**
   * The notes that will be added to the course
   */
  notes: NoteRowModel[];
}
