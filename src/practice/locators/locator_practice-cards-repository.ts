import type { Dependency } from "@/src/common/di/locator-types";
import { locator_common_DatabaseService } from "@/src/common/locators/locator_database-service";
import { locator_common_DateTimeService } from "@/src/common/locators/locator_datetime-service";
import { PracticeCardsRepositoryImpl } from "../../practice/data/repositories/practice-cards-repository-impl";
import type { PracticeCardsRepository } from "../domain/interfaces/practice-cards-repository";

export const locator_practice_PracticeCardsRepository: Dependency<
  PracticeCardsRepository
> = () =>
  new PracticeCardsRepositoryImpl(
    locator_common_DatabaseService(),
    locator_common_DateTimeService(),
  );
