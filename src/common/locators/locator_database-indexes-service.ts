import { DatabaseIndexesServiceImpl } from "../data/services/database-indexes-service-impl";
import type { Dependency } from "../di/locator-types";
import type { DatabaseIndexesService } from "../domain/interfaces/database-indexes-service";
import { locator_common_DatabaseService } from "./locator_database-service";

export const locator_common_DatabaseIndexesService: Dependency<
  DatabaseIndexesService
> = () => new DatabaseIndexesServiceImpl(locator_common_DatabaseService());
