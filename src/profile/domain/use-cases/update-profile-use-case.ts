import type { FileUploadsRepository } from "@/src/file-upload/domain/interfaces/file-uploads-repository";
import type { ProfilesRepository } from "@/src/profile/domain/interfaces/profiles-repository";
import type { TagsRepository } from "@/src/tags/domain/interfaces/tags-repository";
import { ProfileDoesNotExistError } from "../errors/profile-errors";
import type { UpdateProfileInputModel } from "../models/update-profile-input-model";

export class UpdateProfileUseCase {
  constructor(
    private readonly tagsRepository: TagsRepository,
    private readonly profilesRepository: ProfilesRepository,
    private readonly fileUploadsRepository: FileUploadsRepository,
  ) {}

  async execute(input: UpdateProfileInputModel): Promise<void> {
    const profile = await this.profilesRepository.get(input.id);
    if (!profile) throw new ProfileDoesNotExistError();

    if (input.picture && input.picture !== profile.picture) {
      await this.fileUploadsRepository.setCurrent(input.picture);
    }
    if (
      input.backgroundPicture &&
      input.backgroundPicture !== profile.backgroundPicture
    ) {
      await this.fileUploadsRepository.setCurrent(input.backgroundPicture);
    }
    await Promise.all([
      this.tagsRepository.create(input.tags),
      this.profilesRepository.update(input),
    ]);
  }
}
