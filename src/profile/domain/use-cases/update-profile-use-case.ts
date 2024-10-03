import type { ProfilesRepository } from "@/src/profile/domain/interfaces/profiles-repository";
import type { TagsRepository } from "@/src/tags/domain/interfaces/tags-repository";
import { ProfileDoesNotExistError } from "../errors/profile-errors";
import type { UpdateProfileInputModel } from "../models/update-profile-input-model";
import type { GetMyProfileUseCase } from "./get-my-profile-use-case";

/**
 * Edits the data of the profile of the currently logged in user
 *
 * @param input The data of the profile that will be changed
 * @throws {ProfileDoesNotExistError} When the user is not logged in
 */
export class UpdateProfileUseCase {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly tagsRepository: TagsRepository,
    private readonly profilesRepository: ProfilesRepository,
  ) {}

  /**
   * Edits the data of the profile of the currently logged in user
   *
   * @param input The data of the profile that will be changed
   * @throws {ProfileDoesNotExistError} When the user is not logged in
   */
  async execute(input: Omit<UpdateProfileInputModel, "id">): Promise<void> {
    const profile = await this.getMyProfileUseCase.execute();
    if (!profile) throw new ProfileDoesNotExistError();

    await Promise.all([
      this.tagsRepository.create(input.tags),
      this.profilesRepository.update({
        id: profile.id,
        ...input,
      }),
    ]);
  }
}
