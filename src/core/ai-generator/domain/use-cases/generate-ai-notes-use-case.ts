import { AiNotesGeneratorService } from "@/src/core/ai-generator/domain/interfaces/ai-notes-generator-service";
import { NoPermissionError } from "@/src/core/app/domain/models/app-errors";
import { CoursesRepository } from "@/src/core/courses/domain/interfaces/courses-repository";
import { CourseDoesNotExistError } from "@/src/core/courses/domain/models/course-errors";
import { GenerateAiNotesUseCaseInputModel } from "@/src/core/notes/domain/models/generate-ai-notes-input-model";
import { NoteRowModel } from "@/src/core/notes/domain/models/note-row-model";

export class GenerateAiNotesUseCase {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly aiNotesGeneratorService: AiNotesGeneratorService,
  ) {}

  async execute({
    courseId,
    profileId,
    ...input
  }: GenerateAiNotesUseCaseInputModel): Promise<NoteRowModel[]> {
    const course = await this.coursesRepository.getDetail({
      id: courseId,
      profileId,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (!course.canEdit) throw new NoPermissionError();
    const generated = await this.aiNotesGeneratorService.generate(input);
    return generated.map(([front, back]) => ({ front, back }));
  }
}
