import type { FileUploadsRepository } from "@/src/file-upload/domain/interfaces/file-uploads-repository";
import type { ProfilesRepository } from "@/src/profile/domain/interfaces/profiles-repository";
import type { TagsRepository } from "@/src/tags/domain/interfaces/tags-repository";
import { ProfileDoesNotExistError } from "../errors/profile-errors";
import type { UpdateProfileInputModel } from "../models/update-profile-input-model";
import type { GetMyProfileUseCase } from "./get-my-profile-use-case";

export class UpdateProfileUseCase {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly tagsRepository: TagsRepository,
    private readonly profilesRepository: ProfilesRepository,
    private readonly fileUploadsRepository: FileUploadsRepository,
  ) {}

  async execute(input: Omit<UpdateProfileInputModel, "id">): Promise<void> {
    const profile = await this.getMyProfileUseCase.execute();
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
      this.profilesRepository.update({
        id: profile.id,
        ...input,
      }),
    ]);
  }
}
