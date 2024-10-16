import { fetchSession } from "@/src/auth/ui/fetch/fetch-session";
import type { Dependency } from "@/src/common/di/locator-types";
import { GetMyProfileUseCase } from "../domain/use-cases/get-my-profile-use-case";
import { locator_profiles_ProfilesRepository } from "./locator_profiles-repository";

export const locator_profile_GetMyProfileUseCase: Dependency<
  GetMyProfileUseCase
> = () =>
  new GetMyProfileUseCase(fetchSession, locator_profiles_ProfilesRepository());
