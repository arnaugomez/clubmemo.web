import type { AiNotesGeneratorService } from "../../ai-generator/domain/interfaces/ai-notes-generator-service";
import { AuthServiceImpl } from "../../auth/data/services/auth-service-impl";
import type { AuthService } from "../../auth/domain/interfaces/auth-service";
import type { EmailVerificationCodesRepository } from "../../auth/domain/interfaces/email-verification-codes-repository";
import type { ForgotPasswordTokensRepository } from "../../auth/domain/interfaces/forgot-password-tokens-repository";
import type { UsersRepository } from "../../auth/domain/interfaces/users-repository";
import type { CourseAuthorsRepository } from "../../courses/domain/interfaces/course-authors-repository";
import type { CourseEnrollmentsRepository } from "../../courses/domain/interfaces/course-enrollments-repository";
import type { CoursesRepository } from "../../courses/domain/interfaces/courses-repository";
import type { FileUploadService } from "../../file-upload/domain/interfaces/file-upload-service";
import type { FileUploadsRepository } from "../../file-upload/domain/interfaces/file-uploads-repository";
import type { NotesRepository } from "../../notes/domain/interfaces/notes-repository";
import type { PracticeCardsRepository } from "../../practice/domain/interfaces/practice-cards-repository";
import type { ReviewLogsRepository } from "../../practice/domain/interfaces/review-logs-repository";
import type { ProfilesRepository } from "../../profile/domain/interfaces/profiles-repository";
import { RateLimitsRepositoryImpl } from "../../rate-limits/data/repositories/rate-limits-repository-impl";
import type { RateLimitsRepository } from "../../rate-limits/domain/interfaces/rate-limits-repository";
import type { TagsRepository } from "../../tags/domain/interfaces/tags-repository";
import { CookieServiceNextJsImpl } from "../data/services/cookie-service-next-js-impl";
import { EnvServiceImpl } from "../data/services/env-service-impl";
import { MongoServiceImpl } from "../data/services/mongo-service-impl";
import type { CookieService } from "../domain/interfaces/cookie-service";
import type { DateTimeService } from "../domain/interfaces/date-time-service";
import type { EmailService } from "../domain/interfaces/email-service";
import type { EnvService } from "../domain/interfaces/env-service";
import type { IpService } from "../domain/interfaces/ip-service";
import type { MongoService } from "../domain/interfaces/mongo-service";
import { clientLocator } from "./client-locator";
import type { Dependency, Lazy } from "./locator-types";
import { singleton } from "./locator-utils";

interface Locator {
  EnvService: Dependency<EnvService>;
  MongoService: Dependency<MongoService>;
  EmailService: Lazy<EmailService>;
  DateTimeService: Lazy<DateTimeService>;
  FileUploadService: Lazy<FileUploadService>;
  IpService: Lazy<IpService>;

  // Auth
  AuthService: Dependency<AuthService>;
  EmailVerificationCodesRepository: Lazy<EmailVerificationCodesRepository>;
  ForgotPasswordTokensRepository: Lazy<ForgotPasswordTokensRepository>;
  UsersRepository: Lazy<UsersRepository>;
  CookieService: Dependency<CookieService>;
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
  // File Uploads
  FileUploadsRepository: Lazy<FileUploadsRepository>;
  // Rate Limits
  RateLimitsRepository: Dependency<RateLimitsRepository>;
}

/**
 * A simple service locator for dependency injection.
 */
export const locator: Locator = {
  EnvService: singleton(() => new EnvServiceImpl()),
  MongoService: singleton(() => new MongoServiceImpl(locator.EnvService())),
  IpService: singleton(async () => {
    const file = await import("../data/services/ip-service-vercel-impl");
    return new file.IpServiceVercelImpl();
  }),
  async EmailService() {
    const envService = this.EnvService();
    if (envService.sendEmail) {
      const file = await import("../data/services/email-service-impl");
      return new file.EmailServiceImpl(envService);
    }
    const file = await import("../data/services/email-service-fake-impl");
    return new file.EmailServiceFakeImpl(envService);
  },
  DateTimeService: singleton(() =>
    import("../data/services/date-time-service-impl").then(
      (file) => new file.DateTimeServiceImpl(),
    ),
  ),
  FileUploadService: singleton(() =>
    import("../../file-upload/data/services/file-upload-service-s3-impl").then(
      (file) => new file.FileUploadServiceS3Impl(locator.EnvService()),
    ),
  ),
  CookieService: singleton(() => new CookieServiceNextJsImpl()),

  // Auth
  AuthService: singleton(
    () => new AuthServiceImpl(locator.EnvService(), locator.MongoService()),
  ),
  async EmailVerificationCodesRepository() {
    const file = await import(
      "../../auth/data/repositories/email-verification-codes-repository-impl"
    );
    return new file.EmailVerificationCodesRepositoryImpl(this.MongoService());
  },
  async ForgotPasswordTokensRepository() {
    const file = await import(
      "../../auth/data/repositories/forgot-password-tokens-repository-impl"
    );
    return new file.ForgotPasswordTokensRepositoryImpl(this.MongoService());
  },
  async UsersRepository() {
    const file = await import(
      "../../auth/data/repositories/users-repository-impl"
    );
    return new file.UsersRepositoryImpl(this.MongoService());
  },

  // Profile
  async ProfilesRepository() {
    const file = await import(
      "../../profile/data/repositories/profiles-repository-impl"
    );
    return new file.ProfilesRepositoryImpl(this.MongoService());
  },

  // Courses
  async CoursesRepository() {
    const file = await import(
      "../../courses/data/repositories/courses-repository-impl"
    );
    return new file.CoursesRepositoryImpl(
      this.MongoService(),
      await this.DateTimeService(),
    );
  },
  async CourseEnrollmentsRepository() {
    const file = await import(
      "../../courses/data/repositories/course-enrollments-repository-impl"
    );
    return new file.CourseEnrollmentsRepositoryImpl(this.MongoService());
  },
  async CourseAuthorsRepository() {
    const file = await import(
      "../../courses/data/repositories/course-authors-repository-impl"
    );
    return new file.CourseAuthorsRepositoryImpl(this.MongoService());
  },

  // Tags
  async TagsRepository() {
    const file = await import(
      "../../tags/data/repositories/tags-repository-impl"
    );
    return new file.TagsRepositoryImpl(this.MongoService());
  },
  // Notes
  async NotesRepository() {
    const file = await import(
      "../../notes/data/repositories/notes-repository-impl"
    );
    return new file.NotesRepositoryImpl(this.MongoService());
  },
  // Ai Generator
  async AiNotesGeneratorService() {
    const envService = this.EnvService();
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
      clientLocator.ErrorTrackingService(),
    );
  },
  // Practice
  async PracticeCardsRepository() {
    const file = await import(
      "../../practice/data/repositories/practice-cards-repository-impl"
    );
    return new file.PracticeCardsRepositoryImpl(
      this.MongoService(),
      await this.DateTimeService(),
    );
  },
  async ReviewLogsRepository() {
    const file = await import(
      "../../practice/data/repositories/review-logs-repository-impl"
    );
    return new file.ReviewLogsRepositoryImpl(
      this.MongoService(),
      await this.DateTimeService(),
    );
  },
  // File Uploads
  async FileUploadsRepository() {
    const file = await import(
      "../../file-upload/data/repositories/file-uploads-repository-impl"
    );
    return new file.FileUploadsRepositoryImpl(
      await this.FileUploadService(),
      this.MongoService(),
    );
  },

  // Rate Limits
  RateLimitsRepository: singleton(
    () => new RateLimitsRepositoryImpl(locator.MongoService()),
  ),
};
