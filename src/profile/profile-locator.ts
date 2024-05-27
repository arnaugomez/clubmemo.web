import { fetchSession } from "../auth/ui/fetch/fetch-session";
import { locator } from "../common/di/locator";
import type { Lazy } from "../common/di/locator-types";
import type { EditProfileUploadUseCase } from "./domain/use-cases/edit-profile-upload-use-case";
import { GetMyProfileUseCase } from "./domain/use-cases/get-my-profile-use-case";
import type { UpdateProfileUseCase } from "./domain/use-cases/update-profile-use-case";

interface ProfileLocator {
  GetMyProfileUseCase: Lazy<GetMyProfileUseCase>;
  UpdateProfileUseCase: Lazy<UpdateProfileUseCase>;
  EditProfileUploadUseCase: Lazy<EditProfileUploadUseCase>;
}

export const profileLocator: ProfileLocator = {
  async GetMyProfileUseCase() {
    return new GetMyProfileUseCase(
      fetchSession,
      await locator.ProfilesRepository(),
    );
  },
  async UpdateProfileUseCase() {
    const file = await import("./domain/use-cases/update-profile-use-case");
    return new file.UpdateProfileUseCase(
      await this.GetMyProfileUseCase(),
      await locator.TagsRepository(),
      await locator.ProfilesRepository(),
      await locator.FileUploadsRepository(),
    );
  },
  async EditProfileUploadUseCase() {
    const file = await import(
      "./domain/use-cases/edit-profile-upload-use-case"
    );
    return new file.EditProfileUploadUseCase(
      await this.GetMyProfileUseCase(),
      locator.RateLimitsRepository(),
      await locator.FileUploadsRepository(),
    );
  },
};
