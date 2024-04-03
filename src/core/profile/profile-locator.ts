
import { Lazy, locator } from "../app/locator";
import { UpdateProfileUseCase } from "./domain/use-cases/update-profile-use-case";

interface ProfileLocator {
  UpdateProfileUseCase: Lazy<UpdateProfileUseCase>;
}

export const profileLocator: ProfileLocator = {
  UpdateProfileUseCase: async () => {
    const file = await import("./domain/use-cases/update-profile-use-case");
    return new file.UpdateProfileUseCase(
      await locator.TagsRepository(),
      await locator.ProfilesRepository(),
    );
  },
};
