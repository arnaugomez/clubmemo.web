import { fetchSession } from "../auth/ui/fetch/fetch-session";
import { locator } from "../common/di/locator";
import type { Lazy } from "../common/di/locator-types";
import { GetMyProfileUseCase } from "./domain/use-cases/get-my-profile-use-case";
import type { UpdateProfileUseCase } from "./domain/use-cases/update-profile-use-case";

interface ProfileLocator {
  GetMyProfileUseCase: Lazy<GetMyProfileUseCase>;
  UpdateProfileUseCase: Lazy<UpdateProfileUseCase>;
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
    );
  },
};
