import type { Dependency } from "@/src/common/di/locator-types";
import { singleton } from "@/src/common/di/locator-utils";
import { locator_common_DatabaseService } from "@/src/common/locators/locator_database-service";
import { RateLimitsRepositoryImpl } from "../data/repositories/rate-limits-repository-impl";
import type { RateLimitsRepository } from "../domain/interfaces/rate-limits-repository";

export const locator_rateLimits_RateLimitsRepository: Dependency<RateLimitsRepository> =
  singleton(
    () => new RateLimitsRepositoryImpl(locator_common_DatabaseService()),
  );
