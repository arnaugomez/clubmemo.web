import type { Dependency } from "@/src/common/di/locator-types";
import { locator_common_DatabaseService } from "@/src/common/locators/locator_database-service";
import { CoursePermissionsRepositoryImpl } from "../data/repositories/course-permissions-repository-impl";
import type { CoursePermissionsRepository } from "../domain/interfaces/course-permissions-repository";

export const locator_courses_CoursePermissionsRepository: Dependency<
  CoursePermissionsRepository
> = () => new CoursePermissionsRepositoryImpl(locator_common_DatabaseService());
