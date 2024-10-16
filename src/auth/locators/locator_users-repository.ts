import type { Dependency } from "@/src/common/di/locator-types";
import { locator_common_DatabaseService } from "@/src/common/locators/locator_database-service";
import { UsersRepositoryImpl } from "../data/repositories/users-repository-impl";
import type { UsersRepository } from "../domain/interfaces/users-repository";

export const locator_auth_UsersRepository: Dependency<UsersRepository> = () =>
  new UsersRepositoryImpl(locator_common_DatabaseService());
