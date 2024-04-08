import { ProfilesRepository } from "@/src/core/profile/domain/interfaces/profiles-repository";
import { UpdateProfileInputModel } from "../models/update-profile-input-model";
import { TagsRepository } from "@/src/core/tags/domain/interfaces/tags-repository";

export class UpdateProfileUseCase {
  constructor(
    private readonly tagsRepository: TagsRepository,
    private readonly profilesRepository: ProfilesRepository,
  ) {}

  async execute(input: UpdateProfileInputModel): Promise<void> {
    await Promise.all([
      this.tagsRepository.create(input.tags),
      this.profilesRepository.update(input),
    ]);
  }
}
