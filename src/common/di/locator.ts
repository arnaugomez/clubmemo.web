import type { AiNotesGeneratorService } from "../../ai-generator/domain/interfaces/ai-notes-generator-service";
import type { CourseAuthorsRepository } from "../../courses/domain/interfaces/course-authors-repository";
import type { CourseEnrollmentsRepository } from "../../courses/domain/interfaces/course-enrollments-repository";
import type { CoursesRepository } from "../../courses/domain/interfaces/courses-repository";
import type { NotesRepository } from "../../notes/domain/interfaces/notes-repository";
import type { PracticeCardsRepository } from "../../practice/domain/interfaces/practice-cards-repository";
import { locator_common_DatabaseService } from "../locators/locator_database-service";
import { locator_common_DateTimeService } from "../locators/locator_datetime-service";
import { locator_common_EnvService } from "../locators/locator_env-service";
import { locator_common_ErrorTrackingService } from "../locators/locator_error-tracking-service";
import type { Lazy } from "./locator-types";

/**
 * A simple service locator for dependency injection.
 * It contains functions that return the dependencies of the project.
 *
 * These depenencies are only used in the server. See `ClientLocator` for the dependencies
 * that are used in both the client and server side of the application.
 */
interface Locator {
  // Auth
  // Profiles
  // Courses
  CoursesRepository: Lazy<CoursesRepository>;
  CourseEnrollmentsRepository: Lazy<CourseEnrollmentsRepository>;
  CourseAuthorsRepository: Lazy<CourseAuthorsRepository>;
  NotesRepository: Lazy<NotesRepository>;
  // Ai Generator
  AiNotesGeneratorService: Lazy<AiNotesGeneratorService>;
  // Practice
  PracticeCardsRepository: Lazy<PracticeCardsRepository>;
  // Rate Limits
}

/**
 * A simple service locator for dependency injection.
 */
export const locator: Locator = {
  // Courses
  async CoursesRepository() {
    const file = await import(
      "../../courses/data/repositories/courses-repository-impl"
    );
    return new file.CoursesRepositoryImpl(
      locator_common_DatabaseService(),
      locator_common_DateTimeService(),
    );
  },
  async CourseEnrollmentsRepository() {
    const file = await import(
      "../../courses/data/repositories/course-enrollments-repository-impl"
    );
    return new file.CourseEnrollmentsRepositoryImpl(
      locator_common_DatabaseService(),
    );
  },
  async CourseAuthorsRepository() {
    const file = await import(
      "../../courses/data/repositories/course-authors-repository-impl"
    );
    return new file.CourseAuthorsRepositoryImpl(
      locator_common_DatabaseService(),
    );
  },

  // Notes
  async NotesRepository() {
    const file = await import(
      "../../notes/data/repositories/notes-repository-impl"
    );
    return new file.NotesRepositoryImpl(locator_common_DatabaseService());
  },
  // Ai Generator
  async AiNotesGeneratorService() {
    const envService = locator_common_EnvService();
    if (envService.fakeOpenAiApi) {
      const file = await import(
        "../../ai-generator/data/services/ai-notes-generator-service-fake-impl"
      );
      return new file.AiNotesGeneratorServiceFakeImpl();
    }

    const file = await import(
      "../../ai-generator/data/services/ai-notes-generator-service-openai-impl"
    );
    return new file.AiNotesGeneratorServiceOpenaiImpl(
      envService,
      locator_common_ErrorTrackingService(),
    );
  },
  // Practice
  async PracticeCardsRepository() {
    const file = await import(
      "../../practice/data/repositories/practice-cards-repository-impl"
    );
    return new file.PracticeCardsRepositoryImpl(
      locator_common_DatabaseService(),
      locator_common_DateTimeService(),
    );
  },
};
