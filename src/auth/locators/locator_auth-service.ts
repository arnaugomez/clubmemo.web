import type { Dependency } from "@/src/common/di/locator-types";
import { singleton } from "@/src/common/di/locator-utils";
import { locator_common_DatabaseService } from "@/src/common/locators/locator_database-service";
import { locator_common_EnvService } from "@/src/common/locators/locator_env-service";
import { AuthServiceImpl } from "../data/services/auth-service-impl";
import type { AuthService } from "../domain/interfaces/auth-service";

export const locator_auth_AuthService: Dependency<AuthService> = singleton(
  () =>
    new AuthServiceImpl(
      locator_common_EnvService(),
      locator_common_DatabaseService(),
    ),
);
