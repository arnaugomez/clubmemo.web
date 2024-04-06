import { AiNotesGeneratorService } from "@/src/core/ai-generator/domain/interfaces/ai-notes-generator-service";
import { NoPermissionError } from "@/src/core/app/domain/models/app-errors";
import { CoursesRepository } from "@/src/core/courses/domain/interfaces/courses-repository";
import { CourseDoesNotExistError } from "@/src/core/courses/domain/models/course-errors";
import { NotesRepository } from "../interfaces/notes-repository";
import { GenerateAiNotesUseCaseInputModel } from "../models/generate-ai-notes-input-model";
import { NoteModel } from "../models/note-model";

export class GenerateAiNotesUseCase {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly notesRepository: NotesRepository,
    private readonly aiNotesGeneratorService: AiNotesGeneratorService,
  ) {}

  async execute({
    courseId,
    profileId,
    ...input
  }: GenerateAiNotesUseCaseInputModel): Promise<NoteModel[]> {
    const course = await this.coursesRepository.getDetail({
      id: courseId,
      profileId,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (!course.canEdit) throw new NoPermissionError();
    const generated = await this.aiNotesGeneratorService.generate(input);
    const newNotes = generated.map(([front, back]) => ({ front, back }));

    return await this.notesRepository.createMany(courseId, newNotes);
  }
}
