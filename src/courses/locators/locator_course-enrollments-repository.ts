import type { Dependency } from "@/src/common/di/locator-types";
import { locator_common_DatabaseService } from "@/src/common/locators/locator_database-service";
import { CourseEnrollmentsRepositoryImpl } from "../data/repositories/course-enrollments-repository-impl";
import type { CourseEnrollmentsRepository } from "../domain/interfaces/course-enrollments-repository";

export const locator_courses_CourseEnrollmentsRepository: Dependency<
  CourseEnrollmentsRepository
> = () => new CourseEnrollmentsRepositoryImpl(locator_common_DatabaseService());
