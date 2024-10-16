import type { Dependency } from "@/src/common/di/locator-types";
import { locator_common_DatabaseService } from "@/src/common/locators/locator_database-service";
import { ProfilesRepositoryImpl } from "../data/repositories/profiles-repository-impl";
import type { ProfilesRepository } from "../domain/interfaces/profiles-repository";

export const locator_profiles_ProfilesRepository: Dependency<
  ProfilesRepository
> = () => new ProfilesRepositoryImpl(locator_common_DatabaseService());
