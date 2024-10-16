import type { Dependency } from "@/src/common/di/locator-types";
import { locator_profiles_ProfilesRepository } from "@/src/profile/locators/locator_profiles-repository";
import { DeleteUserUseCase } from "../domain/use-cases/delete-user-use-case";
import { locator_auth_AuthService } from "./locator_auth-service";
import { locator_auth_GetSessionUseCase } from "./locator_get-session-use-case";
import { locator_auth_UsersRepository } from "./locator_users-repository";

export const locator_auth_DeleteUserUseCase: Dependency<
  DeleteUserUseCase
> = () =>
  new DeleteUserUseCase(
    locator_auth_GetSessionUseCase(),
    locator_auth_AuthService(),
    locator_auth_UsersRepository(),
    locator_profiles_ProfilesRepository(),
  );
