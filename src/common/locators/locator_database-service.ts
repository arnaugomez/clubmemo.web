import { DatabaseServiceImpl } from "../data/services/database-service-impl";
import type { Dependency } from "../di/locator-types";
import { singleton } from "../di/locator-utils";
import type { DatabaseService } from "../domain/interfaces/database-service";
import { locator_common_EnvService } from "./locator_env-service";

export const locator_common_DatabaseService: Dependency<DatabaseService> =
  singleton(() => new DatabaseServiceImpl(locator_common_EnvService()));
