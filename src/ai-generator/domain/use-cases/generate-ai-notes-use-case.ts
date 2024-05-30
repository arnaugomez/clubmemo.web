import type { AiNotesGeneratorService } from "@/src/ai-generator/domain/interfaces/ai-notes-generator-service";
import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import type { CoursesRepository } from "@/src/courses/domain/interfaces/courses-repository";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import type { GenerateAiNotesUseCaseInputModel } from "@/src/notes/domain/models/generate-ai-notes-input-model";
import type { NoteRowModel } from "@/src/notes/domain/models/note-row-model";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import type { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import type { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";

export class GenerateAiNotesUseCase {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly coursesRepository: CoursesRepository,
    private readonly aiNotesGeneratorService: AiNotesGeneratorService,
    private readonly rateLimitsRepository: RateLimitsRepository,
  ) {}

  async execute({
    courseId,
    ...input
  }: GenerateAiNotesUseCaseInputModel): Promise<NoteRowModel[]> {
    const profile = await this.getMyProfileUseCase.execute();
    if (!profile) throw new ProfileDoesNotExistError();
    const profileId = profile.id;

    const rateLimitKey = `GenerateAiNotesUseCase/${profileId}`;

    await this.rateLimitsRepository.check(rateLimitKey, 50);

    const course = await this.coursesRepository.getDetail({
      id: courseId,
      profileId,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (!course.canEdit) throw new NoPermissionError();
    const generated = await this.aiNotesGeneratorService.generate(input);
    await this.rateLimitsRepository.increment(rateLimitKey);
    return generated.map(([front, back]) => ({ front, back }));
  }
}
