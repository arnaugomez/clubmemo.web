import type { Dependency } from "@/src/common/di/locator-types";
import { locator_common_DatabaseService } from "@/src/common/locators/locator_database-service";
import { locator_common_DateTimeService } from "@/src/common/locators/locator_datetime-service";
import { CoursesRepositoryImpl } from "../data/repositories/courses-repository-impl";
import type { CoursesRepository } from "../domain/interfaces/courses-repository";

export const locator_courses_CoursesRepository: Dependency<
  CoursesRepository
> = () =>
  new CoursesRepositoryImpl(
    locator_common_DatabaseService(),
    locator_common_DateTimeService(),
  );
