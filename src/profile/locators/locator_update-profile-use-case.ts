import type { Dependency } from "@/src/common/di/locator-types";
import { locator_tags_TagsRepository } from "@/src/tags/locators/locator_tags-repository";
import { UpdateProfileUseCase } from "../domain/use-cases/update-profile-use-case";
import { locator_profile_GetMyProfileUseCase } from "./locator_get-my-profile-use-case";
import { locator_profiles_ProfilesRepository } from "./locator_profiles-repository";

export const locator_profile_UpdateProfileUseCase: Dependency<
  UpdateProfileUseCase
> = () =>
  new UpdateProfileUseCase(
    locator_profile_GetMyProfileUseCase(),
    locator_tags_TagsRepository(),
    locator_profiles_ProfilesRepository(),
  );
