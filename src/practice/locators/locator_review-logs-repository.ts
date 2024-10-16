import type { Dependency } from "@/src/common/di/locator-types";
import { locator_common_DatabaseService } from "@/src/common/locators/locator_database-service";
import { locator_common_DateTimeService } from "@/src/common/locators/locator_datetime-service";
import { ReviewLogsRepositoryImpl } from "../data/repositories/review-logs-repository-impl";
import type { ReviewLogsRepository } from "../domain/interfaces/review-logs-repository";

export const locator_practice_ReviewLogsRepository: Dependency<
  ReviewLogsRepository
> = () =>
  new ReviewLogsRepositoryImpl(
    locator_common_DatabaseService(),
    locator_common_DateTimeService(),
  );
