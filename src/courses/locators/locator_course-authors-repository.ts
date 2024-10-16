import type { Dependency } from "@/src/common/di/locator-types";
import { locator_common_DatabaseService } from "@/src/common/locators/locator_database-service";
import { CourseAuthorsRepositoryImpl } from "../data/repositories/course-authors-repository-impl";
import type { CourseAuthorsRepository } from "../domain/interfaces/course-authors-repository";

export const locator_courses_CourseAuthorsRepository: Dependency<
  CourseAuthorsRepository
> = () => new CourseAuthorsRepositoryImpl(locator_common_DatabaseService());
