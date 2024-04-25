import memoizeOne from "memoize-one";
import { AiNotesGeneratorService } from "../ai-generator/domain/interfaces/ai-notes-generator-service";
import { AuthServiceImpl } from "../auth/data/services/auth-service-impl";
import { AuthService } from "../auth/domain/interfaces/auth-service";
import { EmailVerificationCodesRepository } from "../auth/domain/interfaces/email-verification-codes-repository";
import { ForgotPasswordTokensRepository } from "../auth/domain/interfaces/forgot-password-tokens-repository";
import { UsersRepository } from "../auth/domain/interfaces/users-repository";
import { CourseAuthorsRepository } from "../courses/domain/interfaces/course-authors-repository";
import { CourseEnrollmentsRepository } from "../courses/domain/interfaces/course-enrollments-repository";
import { CoursesRepository } from "../courses/domain/interfaces/courses-repository";
import { NotesRepository } from "../notes/domain/interfaces/notes-repository";
import { PracticeCardsRepository } from "../practice/domain/interfaces/practice-cards-repository";
import { ReviewLogsRepository } from "../practice/domain/interfaces/review-logs-repository";
import { EnvServiceImpl } from "./data/services/env-service-impl";
import { MongoServiceImpl } from "./data/services/mongo-service-impl";
import { DateTimeService } from "./domain/interfaces/date-time-service";
import { EmailService } from "./domain/interfaces/email-service";
import { EnvService } from "./domain/interfaces/env-service";
import { MongoService } from "./domain/interfaces/mongo-service";
import { UploadFileService } from "./domain/interfaces/upload-file-service";
import { ProfilesRepository } from "../profile/domain/interfaces/profiles-repository";
import { TagsRepository } from "../tags/domain/interfaces/tags-repository";

export type Dependency<T> = () => T;
export type Lazy<T> = () => Promise<T>;

interface Locator {
  EnvService: Dependency<EnvService>;
  MongoService: Dependency<MongoService>;
  EmailService: Lazy<EmailService>;
  DateTimeService: Lazy<DateTimeService>;
  UploadFileService: Lazy<UploadFileService>;

  // Auth
  AuthService: Dependency<AuthService>;
  EmailVerificationCodesRepository: Lazy<EmailVerificationCodesRepository>;
  ForgotPasswordTokensRepository: Lazy<ForgotPasswordTokensRepository>;
  UsersRepository: Lazy<UsersRepository>;
  // Profiles
  ProfilesRepository: Lazy<ProfilesRepository>;
  // Courses
  CoursesRepository: Lazy<CoursesRepository>;
  CourseEnrollmentsRepository: Lazy<CourseEnrollmentsRepository>;
  CourseAuthorsRepository: Lazy<CourseAuthorsRepository>;
  TagsRepository: Lazy<TagsRepository>;
  NotesRepository: Lazy<NotesRepository>;
  // Ai Generator
  AiNotesGeneratorService: Lazy<AiNotesGeneratorService>;
  // Practice
  PracticeCardsRepository: Lazy<PracticeCardsRepository>;
  ReviewLogsRepository: Lazy<ReviewLogsRepository>;
}

export const singleton = memoizeOne;

/**
 * A simple service locator for dependency injection.
 */
export const locator: Locator = {
  EnvService: singleton(() => new EnvServiceImpl()),
  MongoService: singleton(() => new MongoServiceImpl(locator.EnvService())),
  async EmailService() {
    const envService = this.EnvService();
    if (envService.sendEmail) {
      const file = await import("./data/services/email-service-impl");
      return new file.EmailServiceImpl(envService);
    }
    const file = await import("./data/services/email-service-fake-impl");
    return new file.EmailServiceFakeImpl();
  },
  DateTimeService: singleton(() =>
    import("./data/services/date-time-service-impl").then(
      (file) => new file.DateTimeServiceImpl(),
    ),
  ),
  UploadFileService: singleton(() =>
    import("./data/services/upload-file-service-s3-impl").then(
      (file) => new file.UploadFileServiceS3Impl(locator.EnvService()),
    ),
  ),

  // Auth
  AuthService: singleton(
    () => new AuthServiceImpl(locator.EnvService(), locator.MongoService()),
  ),
  async EmailVerificationCodesRepository() {
    const file = await import(
      "../auth/data/repositories/email-verification-codes-repository-impl"
    );
    return new file.EmailVerificationCodesRepositoryImpl(this.MongoService());
  },
  async ForgotPasswordTokensRepository() {
    const file = await import(
      "../auth/data/repositories/forgot-password-tokens-repository-impl"
    );
    return new file.ForgotPasswordTokensRepositoryImpl(this.MongoService());
  },
  async UsersRepository() {
    const file = await import(
      "../auth/data/repositories/users-repository-impl"
    );
    return new file.UsersRepositoryImpl(this.MongoService());
  },

  // Profile
  async ProfilesRepository() {
    const file = await import(
      "../profile/data/repositories/profiles-repository-impl"
    );
    return new file.ProfilesRepositoryImpl(this.MongoService());
  },

  // Courses
  async CoursesRepository() {
    const file = await import(
      "../courses/data/repositories/courses-repository-impl"
    );
    return new file.CoursesRepositoryImpl(
      this.MongoService(),
      await this.DateTimeService(),
    );
  },
  async CourseEnrollmentsRepository() {
    const file = await import(
      "../courses/data/repositories/course-enrollments-repository-impl"
    );
    return new file.CourseEnrollmentsRepositoryImpl(this.MongoService());
  },
  async CourseAuthorsRepository() {
    const file = await import(
      "../courses/data/repositories/course-authors-repository-impl"
    );
    return new file.CourseAuthorsRepositoryImpl(this.MongoService());
  },

  // Tags
  async TagsRepository() {
    const file = await import("../tags/data/repositories/tags-repository-impl");
    return new file.TagsRepositoryImpl(this.MongoService());
  },
  // Notes
  async NotesRepository() {
    const file = await import(
      "../notes/data/repositories/notes-repository-impl"
    );
    return new file.NotesRepositoryImpl(this.MongoService());
  },
  // Ai Generator
  async AiNotesGeneratorService() {
    const envService = this.EnvService();
    if (envService.fakeOpenAiApi) {
      const file = await import(
        "../ai-generator/data/services/ai-notes-generator-service-fake-impl"
      );
      return new file.AiNotesGeneratorServiceFakeImpl();
    }

    const file = await import(
      "../ai-generator/data/services/ai-notes-generator-service-impl"
    );
    return new file.AiNotesGeneratorServiceImpl(envService);
  },
  // Practice
  async PracticeCardsRepository() {
    const file = await import(
      "../practice/data/repositories/practice-cards-repository-impl"
    );
    return new file.PracticeCardsRepositoryImpl(
      this.MongoService(),
      await this.DateTimeService(),
    );
  },
  async ReviewLogsRepository() {
    const file = await import(
      "../practice/data/repositories/review-logs-repository-impl"
    );
    return new file.ReviewLogsRepositoryImpl(
      this.MongoService(),
      await this.DateTimeService(),
    );
  },
};
