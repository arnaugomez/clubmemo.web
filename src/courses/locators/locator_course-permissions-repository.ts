import type { Dependency } from "@/src/common/di/locator-types";
import { CoursePermissionsRepositoryImpl } from "../data/repositories/course-permissions-repository-impl";
import type { CoursePermissionsRepository } from "../domain/interfaces/course-permissions-repository";
import { locator_common_DatabaseService } from "@/src/common/locators/locator_database-service";

export const locator_courses_CoursePermissionsRepository: Dependency<
  CoursePermissionsRepository
> = () => new CoursePermissionsRepositoryImpl(locator_common_DatabaseService());
