import type {
  AiNotesGeneratorService,
  GenerateAiNotesInputModel,
} from "@/src/ai-generator/domain/interfaces/ai-notes-generator-service";
import type { NoteRowModel } from "@/src/notes/domain/models/note-row-model";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import type { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import type { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";

/**
 * Creates a list of AI-generated notes that the user can add to the course.
 *
 * This use case is rate-limited to 50 requests/profile-day.
 */
export class GenerateAiNotesUseCase {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly aiNotesGeneratorService: AiNotesGeneratorService,
    private readonly rateLimitsRepository: RateLimitsRepository,
  ) {}

  /**
   * Creates a list of AI-generated notes that the user can add to the course.
   *
   * This use case is rate-limited to 50 requests/profile-day.
   */
  async execute({
    ...input
  }: GenerateAiNotesInputModel): Promise<NoteRowModel[]> {
    const profile = await this.getMyProfileUseCase.execute();
    if (!profile) throw new ProfileDoesNotExistError();

    const rateLimitKey = `GenerateAiNotesUseCase/${profile.id}`;

    await this.rateLimitsRepository.check(rateLimitKey, 50);

    const generated = await this.aiNotesGeneratorService.generate(input);
    await this.rateLimitsRepository.increment(rateLimitKey);
    return generated;
  }
}
