import { ProfilesRepository } from "@/src/profile/domain/interfaces/profiles-repository";
import { TagsRepository } from "@/src/tags/domain/interfaces/tags-repository";
import { UpdateProfileInputModel } from "../models/update-profile-input-model";

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
