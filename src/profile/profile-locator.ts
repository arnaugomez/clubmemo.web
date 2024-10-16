import { fetchSession } from "../auth/ui/fetch/fetch-session";
import type { Lazy } from "../common/di/locator-types";
import { locator_tags_TagsRepository } from "../tags/locators/locator_tags-repository";
import { GetMyProfileUseCase } from "./domain/use-cases/get-my-profile-use-case";
import type { UpdateProfileUseCase } from "./domain/use-cases/update-profile-use-case";
import { locator_profiles_ProfilesRepository } from "./locators/locator_profiles-repository";

interface ProfileLocator {
  GetMyProfileUseCase: Lazy<GetMyProfileUseCase>;
  UpdateProfileUseCase: Lazy<UpdateProfileUseCase>;
}

export const profileLocator: ProfileLocator = {
  async GetMyProfileUseCase() {
    return new GetMyProfileUseCase(
      fetchSession,
      locator_profiles_ProfilesRepository(),
    );
  },
  async UpdateProfileUseCase() {
    const file = await import("./domain/use-cases/update-profile-use-case");
    return new file.UpdateProfileUseCase(
      await this.GetMyProfileUseCase(),
      locator_tags_TagsRepository(),
      locator_profiles_ProfilesRepository(),
    );
  },
};
