import { fetchSession } from "../auth/ui/fetch/fetch-session";
import type { Lazy } from "../common/locator";
import { locator } from "../common/locator";
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
  UpdateProfileUseCase: async () => {
    const file = await import("./domain/use-cases/update-profile-use-case");
    return new file.UpdateProfileUseCase(
      await locator.TagsRepository(),
      await locator.ProfilesRepository(),
      await locator.FileUploadsRepository(),
    );
  },
};
