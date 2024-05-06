import type { AiNotesGeneratorService } from "@/src/ai-generator/domain/interfaces/ai-notes-generator-service";
import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import type { CoursesRepository } from "@/src/courses/domain/interfaces/courses-repository";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import type { GenerateAiNotesUseCaseInputModel } from "@/src/notes/domain/models/generate-ai-notes-input-model";
import type { NoteRowModel } from "@/src/notes/domain/models/note-row-model";

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
