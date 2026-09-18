import * as Cause from "effect/Cause";
import type * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Layer from "effect/Layer";
import * as ManagedRuntime from "effect/ManagedRuntime";
import { unstable_rethrow } from "next/navigation";
import { AdminResourceHooksLive } from "@/src/admin/domain/config/admin-resource-hooks-config";
import { CheckIsAdminUseCaseLive } from "@/src/admin/layers/layer_check-is-admin-use-case";
import { CreateAdminResourceUseCaseLive } from "@/src/admin/layers/layer_create-admin-resource-use-case";
import { DeleteAdminResourceUseCaseLive } from "@/src/admin/layers/layer_delete-admin-resource-use-case";
import { GetAdminResourceDetailUseCaseLive } from "@/src/admin/layers/layer_get-admin-resource-detail-use-case";
import { GetAdminResourcesUseCaseLive } from "@/src/admin/layers/layer_get-admin-resources-use-case";
import { UpdateAdminResourceUseCaseLive } from "@/src/admin/layers/layer_update-admin-resource-use-case";
import { AiNotesGeneratorServiceLive } from "@/src/ai-generator/layers/layer_ai-notes-generator-service";
import { GenerateAiNotesConfirmUseCaseLive } from "@/src/ai-generator/layers/layer_generate-ai-notes-confirm-use-case";
import { GenerateAiNotesUseCaseLive } from "@/src/ai-generator/layers/layer_generate-ai-notes-use-case";
import { AuthServiceLive } from "@/src/auth/layers/layer_auth-service";
import { ChangePasswordUseCaseLive } from "@/src/auth/layers/layer_change-password-use-case";
import { DeleteUserUseCaseLive } from "@/src/auth/layers/layer_delete-user-use-case";
import { EmailVerificationCodesRepositoryLive } from "@/src/auth/layers/layer_email-verification-codes-repository";
import { ForgotPasswordTokensRepositoryLive } from "@/src/auth/layers/layer_forgot-password-tokens-repository";
import { ForgotPasswordUseCaseLive } from "@/src/auth/layers/layer_forgot-password-use-case";
import { GetSessionUseCaseLive } from "@/src/auth/layers/layer_get-session-use-case";
import { LoginWithPasswordUseCaseLive } from "@/src/auth/layers/layer_login-with-password-use-case";
import { LogoutUseCaseLive } from "@/src/auth/layers/layer_logout-use-case";
import { ResetPasswordUseCaseLive } from "@/src/auth/layers/layer_reset-password-use-case";
import { SignupUseCaseLive } from "@/src/auth/layers/layer_signup-use-case";
import { UsersRepositoryLive } from "@/src/auth/layers/layer_users-repository";
import { VerifyEmailUseCaseLive } from "@/src/auth/layers/layer_verify-email-use-case";
import { CookieServiceLive } from "@/src/common/layers/layer_cookie-service";
import { DatabaseIndexesServiceLive } from "@/src/common/layers/layer_database-indexes-service";
import { DatabaseServiceLive } from "@/src/common/layers/layer_database-service";
import { DateTimeServiceLive } from "@/src/common/layers/layer_datetime-service";
import { EmailServiceLive } from "@/src/common/layers/layer_email-service";
import { EnvServiceLive } from "@/src/common/layers/layer_env-service";
import { ErrorTrackingServiceLive } from "@/src/common/layers/layer_error-tracking-service";
import { IpServiceLive } from "@/src/common/layers/layer_ip-service";
import { CopyCourseUseCaseLive } from "@/src/courses/layers/layer_copy-course-use-case";
import { CourseAuthorsRepositoryLive } from "@/src/courses/layers/layer_course-authors-repository";
import { CourseEnrollmentsRepositoryLive } from "@/src/courses/layers/layer_course-enrollments-repository";
import { CoursePermissionsRepositoryLive } from "@/src/courses/layers/layer_course-permissions-repository";
import { CoursesRepositoryLive } from "@/src/courses/layers/layer_courses-repository";
import { CreateCourseUseCaseLive } from "@/src/courses/layers/layer_create-course-use-case";
import { DeleteCourseUseCaseLive } from "@/src/courses/layers/layer_delete-course-use-case";
import { EditCourseConfigUseCaseLive } from "@/src/courses/layers/layer_edit-course-config-use-case";
import { EditCourseUseCaseLive } from "@/src/courses/layers/layer_edit-course-use-case";
import { FavoriteCourseUseCaseLive } from "@/src/courses/layers/layer_favorite-course-use-case";
import { GetInterestingCoursesUseCaseLive } from "@/src/courses/layers/layer_get-interesting-courses-use-case";
import { FileUploadServiceLive } from "@/src/file-upload/layers/layer_file-upload-service";
import { FileUploadsRepositoryLive } from "@/src/file-upload/layers/layer_file-uploads-repository";
import { UploadFileUseCaseLive } from "@/src/file-upload/layers/layer_upload-file-use-case";
import { CreateNoteUseCaseLive } from "@/src/notes/layers/layer_create-note-use-case";
import { DeleteNoteUseCaseLive } from "@/src/notes/layers/layer_delete-note-use-case";
import { GetNotesUseCaseLive } from "@/src/notes/layers/layer_get-notes-use-case";
import { ImportNotesUseCaseLive } from "@/src/notes/layers/layer_import-notes-use-case";
import { NotesRepositoryLive } from "@/src/notes/layers/layer_notes-repository";
import { UpdateNoteUseCaseLive } from "@/src/notes/layers/layer_update-note-use-case";
import { GetCoursePracticeCountUseCaseLive } from "@/src/practice/layers/layer_get-course-practice-count-use-case";
import { GetNextPracticeCardsUseCaseLive } from "@/src/practice/layers/layer_get-next-practice-cards-use-case";
import { GetPracticeCardsUseCaseLive } from "@/src/practice/layers/layer_get-practice-cards-use-case";
import { PracticeCardsRepositoryLive } from "@/src/practice/layers/layer_practice-cards-repository";
import { PracticeUseCaseLive } from "@/src/practice/layers/layer_practice-use-case";
import { ReviewLogsRepositoryLive } from "@/src/practice/layers/layer_review-logs-repository";
import { GetMyProfileUseCaseLive } from "@/src/profile/layers/layer_get-my-profile-use-case";
import { ProfilesRepositoryLive } from "@/src/profile/layers/layer_profiles-repository";
import { UpdateProfileUseCaseLive } from "@/src/profile/layers/layer_update-profile-use-case";
import { RateLimitsRepositoryLive } from "@/src/rate-limits/layers/layer_rate-limits-repository";
import { TagsRepositoryLive } from "@/src/tags/layers/layer_tags-repository";

const CookieServiceLiveProvided = CookieServiceLive;
const DateTimeServiceLiveProvided = DateTimeServiceLive;
const EnvServiceLiveProvided = EnvServiceLive;
const ErrorTrackingServiceLiveProvided = ErrorTrackingServiceLive;
const IpServiceLiveProvided = IpServiceLive;
const AiNotesGeneratorServiceLiveProvided = AiNotesGeneratorServiceLive.pipe(
  Layer.provide([EnvServiceLiveProvided, ErrorTrackingServiceLiveProvided]),
);
const DatabaseServiceLiveProvided = DatabaseServiceLive.pipe(
  Layer.provide([EnvServiceLiveProvided]),
);
const EmailServiceLiveProvided = EmailServiceLive.pipe(
  Layer.provide([EnvServiceLiveProvided]),
);
const FileUploadServiceLiveProvided = FileUploadServiceLive.pipe(
  Layer.provide([EnvServiceLiveProvided]),
);
const AuthServiceLiveProvided = AuthServiceLive.pipe(
  Layer.provide([DatabaseServiceLiveProvided, EnvServiceLiveProvided]),
);
const EmailVerificationCodesRepositoryLiveProvided =
  EmailVerificationCodesRepositoryLive.pipe(
    Layer.provide([DatabaseServiceLiveProvided]),
  );
const ForgotPasswordTokensRepositoryLiveProvided =
  ForgotPasswordTokensRepositoryLive.pipe(
    Layer.provide([DatabaseServiceLiveProvided]),
  );
const UsersRepositoryLiveProvided = UsersRepositoryLive.pipe(
  Layer.provide([DatabaseServiceLiveProvided]),
);
const DatabaseIndexesServiceLiveProvided = DatabaseIndexesServiceLive.pipe(
  Layer.provide([DatabaseServiceLiveProvided]),
);
const CourseAuthorsRepositoryLiveProvided = CourseAuthorsRepositoryLive.pipe(
  Layer.provide([DatabaseServiceLiveProvided]),
);
const CourseEnrollmentsRepositoryLiveProvided =
  CourseEnrollmentsRepositoryLive.pipe(
    Layer.provide([DatabaseServiceLiveProvided]),
  );
const CoursePermissionsRepositoryLiveProvided =
  CoursePermissionsRepositoryLive.pipe(
    Layer.provide([DatabaseServiceLiveProvided]),
  );
const CoursesRepositoryLiveProvided = CoursesRepositoryLive.pipe(
  Layer.provide([DatabaseServiceLiveProvided, DateTimeServiceLiveProvided]),
);
const FileUploadsRepositoryLiveProvided = FileUploadsRepositoryLive.pipe(
  Layer.provide([DatabaseServiceLiveProvided, FileUploadServiceLiveProvided]),
);
const NotesRepositoryLiveProvided = NotesRepositoryLive.pipe(
  Layer.provide([DatabaseServiceLiveProvided]),
);
const PracticeCardsRepositoryLiveProvided = PracticeCardsRepositoryLive.pipe(
  Layer.provide([DatabaseServiceLiveProvided, DateTimeServiceLiveProvided]),
);
const ReviewLogsRepositoryLiveProvided = ReviewLogsRepositoryLive.pipe(
  Layer.provide([DatabaseServiceLiveProvided, DateTimeServiceLiveProvided]),
);
const ProfilesRepositoryLiveProvided = ProfilesRepositoryLive.pipe(
  Layer.provide([DatabaseServiceLiveProvided]),
);
const RateLimitsRepositoryLiveProvided = RateLimitsRepositoryLive.pipe(
  Layer.provide([DatabaseServiceLiveProvided]),
);
const TagsRepositoryLiveProvided = TagsRepositoryLive.pipe(
  Layer.provide([DatabaseServiceLiveProvided]),
);
const ForgotPasswordUseCaseLiveProvided = ForgotPasswordUseCaseLive.pipe(
  Layer.provide([
    ForgotPasswordTokensRepositoryLiveProvided,
    UsersRepositoryLiveProvided,
    EmailServiceLiveProvided,
    IpServiceLiveProvided,
    RateLimitsRepositoryLiveProvided,
  ]),
);
const GetSessionUseCaseLiveProvided = GetSessionUseCaseLive.pipe(
  Layer.provide([AuthServiceLiveProvided, CookieServiceLiveProvided]),
);
const LoginWithPasswordUseCaseLiveProvided = LoginWithPasswordUseCaseLive.pipe(
  Layer.provide([
    AuthServiceLiveProvided,
    CookieServiceLiveProvided,
    IpServiceLiveProvided,
    ProfilesRepositoryLiveProvided,
    RateLimitsRepositoryLiveProvided,
  ]),
);
const ResetPasswordUseCaseLiveProvided = ResetPasswordUseCaseLive.pipe(
  Layer.provide([
    AuthServiceLiveProvided,
    ForgotPasswordTokensRepositoryLiveProvided,
    UsersRepositoryLiveProvided,
    IpServiceLiveProvided,
    RateLimitsRepositoryLiveProvided,
  ]),
);
const SignupUseCaseLiveProvided = SignupUseCaseLive.pipe(
  Layer.provide([
    AuthServiceLiveProvided,
    EmailVerificationCodesRepositoryLiveProvided,
    CookieServiceLiveProvided,
    EmailServiceLiveProvided,
    IpServiceLiveProvided,
    ProfilesRepositoryLiveProvided,
    RateLimitsRepositoryLiveProvided,
  ]),
);
const GetInterestingCoursesUseCaseLiveProvided =
  GetInterestingCoursesUseCaseLive.pipe(
    Layer.provide([
      CoursesRepositoryLiveProvided,
      ProfilesRepositoryLiveProvided,
    ]),
  );
const GetNotesUseCaseLiveProvided = GetNotesUseCaseLive.pipe(
  Layer.provide([NotesRepositoryLiveProvided]),
);
const GetCoursePracticeCountUseCaseLiveProvided =
  GetCoursePracticeCountUseCaseLive.pipe(
    Layer.provide([
      PracticeCardsRepositoryLiveProvided,
      ReviewLogsRepositoryLiveProvided,
    ]),
  );
const GetPracticeCardsUseCaseLiveProvided = GetPracticeCardsUseCaseLive.pipe(
  Layer.provide([
    PracticeCardsRepositoryLiveProvided,
    ReviewLogsRepositoryLiveProvided,
  ]),
);
const AdminResourceHooksLiveProvided = AdminResourceHooksLive.pipe(
  Layer.provide([
    AuthServiceLiveProvided,
    UsersRepositoryLiveProvided,
    EnvServiceLiveProvided,
    CourseEnrollmentsRepositoryLiveProvided,
    CoursePermissionsRepositoryLiveProvided,
    NotesRepositoryLiveProvided,
    ProfilesRepositoryLiveProvided,
  ]),
);
const CheckIsAdminUseCaseLiveProvided = CheckIsAdminUseCaseLive.pipe(
  Layer.provide([GetSessionUseCaseLiveProvided]),
);
const ChangePasswordUseCaseLiveProvided = ChangePasswordUseCaseLive.pipe(
  Layer.provide([
    AuthServiceLiveProvided,
    GetSessionUseCaseLiveProvided,
    CookieServiceLiveProvided,
    RateLimitsRepositoryLiveProvided,
  ]),
);
const DeleteUserUseCaseLiveProvided = DeleteUserUseCaseLive.pipe(
  Layer.provide([
    AuthServiceLiveProvided,
    GetSessionUseCaseLiveProvided,
    UsersRepositoryLiveProvided,
    ProfilesRepositoryLiveProvided,
  ]),
);
const LogoutUseCaseLiveProvided = LogoutUseCaseLive.pipe(
  Layer.provide([
    AuthServiceLiveProvided,
    GetSessionUseCaseLiveProvided,
    CookieServiceLiveProvided,
  ]),
);
const VerifyEmailUseCaseLiveProvided = VerifyEmailUseCaseLive.pipe(
  Layer.provide([
    AuthServiceLiveProvided,
    EmailVerificationCodesRepositoryLiveProvided,
    GetSessionUseCaseLiveProvided,
    CookieServiceLiveProvided,
    RateLimitsRepositoryLiveProvided,
  ]),
);
const UploadFileUseCaseLiveProvided = UploadFileUseCaseLive.pipe(
  Layer.provide([
    GetSessionUseCaseLiveProvided,
    FileUploadsRepositoryLiveProvided,
    RateLimitsRepositoryLiveProvided,
  ]),
);
const GetMyProfileUseCaseLiveProvided = GetMyProfileUseCaseLive.pipe(
  Layer.provide([
    ProfilesRepositoryLiveProvided,
    GetSessionUseCaseLiveProvided,
  ]),
);
const CreateAdminResourceUseCaseLiveProvided =
  CreateAdminResourceUseCaseLive.pipe(
    Layer.provide([
      AdminResourceHooksLiveProvided,
      TagsRepositoryLiveProvided,
      CheckIsAdminUseCaseLiveProvided,
      DatabaseServiceLiveProvided,
    ]),
  );
const DeleteAdminResourceUseCaseLiveProvided =
  DeleteAdminResourceUseCaseLive.pipe(
    Layer.provide([
      AdminResourceHooksLiveProvided,
      TagsRepositoryLiveProvided,
      CheckIsAdminUseCaseLiveProvided,
      DatabaseServiceLiveProvided,
    ]),
  );
const GetAdminResourceDetailUseCaseLiveProvided =
  GetAdminResourceDetailUseCaseLive.pipe(
    Layer.provide([
      CheckIsAdminUseCaseLiveProvided,
      DatabaseServiceLiveProvided,
    ]),
  );
const GetAdminResourcesUseCaseLiveProvided = GetAdminResourcesUseCaseLive.pipe(
  Layer.provide([CheckIsAdminUseCaseLiveProvided, DatabaseServiceLiveProvided]),
);
const UpdateAdminResourceUseCaseLiveProvided =
  UpdateAdminResourceUseCaseLive.pipe(
    Layer.provide([
      AdminResourceHooksLiveProvided,
      TagsRepositoryLiveProvided,
      CheckIsAdminUseCaseLiveProvided,
      DatabaseServiceLiveProvided,
    ]),
  );
const GenerateAiNotesConfirmUseCaseLiveProvided =
  GenerateAiNotesConfirmUseCaseLive.pipe(
    Layer.provide([
      CoursesRepositoryLiveProvided,
      NotesRepositoryLiveProvided,
      GetMyProfileUseCaseLiveProvided,
    ]),
  );
const GenerateAiNotesUseCaseLiveProvided = GenerateAiNotesUseCaseLive.pipe(
  Layer.provide([
    AiNotesGeneratorServiceLiveProvided,
    GetMyProfileUseCaseLiveProvided,
    RateLimitsRepositoryLiveProvided,
  ]),
);
const CopyCourseUseCaseLiveProvided = CopyCourseUseCaseLive.pipe(
  Layer.provide([
    CoursesRepositoryLiveProvided,
    NotesRepositoryLiveProvided,
    GetMyProfileUseCaseLiveProvided,
  ]),
);
const CreateCourseUseCaseLiveProvided = CreateCourseUseCaseLive.pipe(
  Layer.provide([
    CoursesRepositoryLiveProvided,
    GetMyProfileUseCaseLiveProvided,
  ]),
);
const DeleteCourseUseCaseLiveProvided = DeleteCourseUseCaseLive.pipe(
  Layer.provide([
    CourseEnrollmentsRepositoryLiveProvided,
    CoursePermissionsRepositoryLiveProvided,
    CoursesRepositoryLiveProvided,
    NotesRepositoryLiveProvided,
    GetMyProfileUseCaseLiveProvided,
  ]),
);
const EditCourseConfigUseCaseLiveProvided = EditCourseConfigUseCaseLive.pipe(
  Layer.provide([
    CourseEnrollmentsRepositoryLiveProvided,
    GetMyProfileUseCaseLiveProvided,
  ]),
);
const EditCourseUseCaseLiveProvided = EditCourseUseCaseLive.pipe(
  Layer.provide([
    CoursesRepositoryLiveProvided,
    GetMyProfileUseCaseLiveProvided,
    TagsRepositoryLiveProvided,
  ]),
);
const FavoriteCourseUseCaseLiveProvided = FavoriteCourseUseCaseLive.pipe(
  Layer.provide([
    CourseEnrollmentsRepositoryLiveProvided,
    GetMyProfileUseCaseLiveProvided,
  ]),
);
const CreateNoteUseCaseLiveProvided = CreateNoteUseCaseLive.pipe(
  Layer.provide([
    CoursesRepositoryLiveProvided,
    NotesRepositoryLiveProvided,
    GetMyProfileUseCaseLiveProvided,
  ]),
);
const DeleteNoteUseCaseLiveProvided = DeleteNoteUseCaseLive.pipe(
  Layer.provide([
    CoursesRepositoryLiveProvided,
    NotesRepositoryLiveProvided,
    GetMyProfileUseCaseLiveProvided,
  ]),
);
const ImportNotesUseCaseLiveProvided = ImportNotesUseCaseLive.pipe(
  Layer.provide([
    CoursesRepositoryLiveProvided,
    NotesRepositoryLiveProvided,
    GetMyProfileUseCaseLiveProvided,
  ]),
);
const UpdateNoteUseCaseLiveProvided = UpdateNoteUseCaseLive.pipe(
  Layer.provide([
    CoursesRepositoryLiveProvided,
    NotesRepositoryLiveProvided,
    GetMyProfileUseCaseLiveProvided,
  ]),
);
const GetNextPracticeCardsUseCaseLiveProvided =
  GetNextPracticeCardsUseCaseLive.pipe(
    Layer.provide([
      CoursesRepositoryLiveProvided,
      GetPracticeCardsUseCaseLiveProvided,
      GetMyProfileUseCaseLiveProvided,
    ]),
  );
const PracticeUseCaseLiveProvided = PracticeUseCaseLive.pipe(
  Layer.provide([
    CoursesRepositoryLiveProvided,
    PracticeCardsRepositoryLiveProvided,
    ReviewLogsRepositoryLiveProvided,
    GetMyProfileUseCaseLiveProvided,
  ]),
);
const UpdateProfileUseCaseLiveProvided = UpdateProfileUseCaseLive.pipe(
  Layer.provide([
    GetMyProfileUseCaseLiveProvided,
    ProfilesRepositoryLiveProvided,
    TagsRepositoryLiveProvided,
  ]),
);

export const ApplicationLive = Layer.mergeAll(
  CookieServiceLiveProvided,
  DateTimeServiceLiveProvided,
  EnvServiceLiveProvided,
  ErrorTrackingServiceLiveProvided,
  IpServiceLiveProvided,
  AiNotesGeneratorServiceLiveProvided,
  DatabaseServiceLiveProvided,
  EmailServiceLiveProvided,
  FileUploadServiceLiveProvided,
  AuthServiceLiveProvided,
  EmailVerificationCodesRepositoryLiveProvided,
  ForgotPasswordTokensRepositoryLiveProvided,
  UsersRepositoryLiveProvided,
  DatabaseIndexesServiceLiveProvided,
  CourseAuthorsRepositoryLiveProvided,
  CourseEnrollmentsRepositoryLiveProvided,
  CoursePermissionsRepositoryLiveProvided,
  CoursesRepositoryLiveProvided,
  FileUploadsRepositoryLiveProvided,
  NotesRepositoryLiveProvided,
  PracticeCardsRepositoryLiveProvided,
  ReviewLogsRepositoryLiveProvided,
  ProfilesRepositoryLiveProvided,
  RateLimitsRepositoryLiveProvided,
  TagsRepositoryLiveProvided,
  ForgotPasswordUseCaseLiveProvided,
  GetSessionUseCaseLiveProvided,
  LoginWithPasswordUseCaseLiveProvided,
  ResetPasswordUseCaseLiveProvided,
  SignupUseCaseLiveProvided,
  GetInterestingCoursesUseCaseLiveProvided,
  GetNotesUseCaseLiveProvided,
  GetCoursePracticeCountUseCaseLiveProvided,
  GetPracticeCardsUseCaseLiveProvided,
  AdminResourceHooksLiveProvided,
  CheckIsAdminUseCaseLiveProvided,
  ChangePasswordUseCaseLiveProvided,
  DeleteUserUseCaseLiveProvided,
  LogoutUseCaseLiveProvided,
  VerifyEmailUseCaseLiveProvided,
  UploadFileUseCaseLiveProvided,
  GetMyProfileUseCaseLiveProvided,
  CreateAdminResourceUseCaseLiveProvided,
  DeleteAdminResourceUseCaseLiveProvided,
  GetAdminResourceDetailUseCaseLiveProvided,
  GetAdminResourcesUseCaseLiveProvided,
  UpdateAdminResourceUseCaseLiveProvided,
  GenerateAiNotesConfirmUseCaseLiveProvided,
  GenerateAiNotesUseCaseLiveProvided,
  CopyCourseUseCaseLiveProvided,
  CreateCourseUseCaseLiveProvided,
  DeleteCourseUseCaseLiveProvided,
  EditCourseConfigUseCaseLiveProvided,
  EditCourseUseCaseLiveProvided,
  FavoriteCourseUseCaseLiveProvided,
  CreateNoteUseCaseLiveProvided,
  DeleteNoteUseCaseLiveProvided,
  ImportNotesUseCaseLiveProvided,
  UpdateNoteUseCaseLiveProvided,
  GetNextPracticeCardsUseCaseLiveProvided,
  PracticeUseCaseLiveProvided,
  UpdateProfileUseCaseLiveProvided,
);
const runtime = ManagedRuntime.make(ApplicationLive);

// Rebuild dependencies after a hot reload and release the previous SDK clients.
if (typeof module !== "undefined") {
  (
    module as NodeModule & { hot?: { dispose(callback: () => void): void } }
  ).hot?.dispose(() => {
    void runtime.dispose();
  });
}

/** Execute only at Next.js boundaries; domain programs remain lazy and composable. */
export async function runServer<A, E>(
  program: Effect.Effect<A, E, Layer.Success<typeof ApplicationLive>>,
): Promise<A> {
  const exit = await runtime.runPromiseExit(program);
  if (Exit.isSuccess(exit)) return exit.value;
  const error = Cause.squash(exit.cause);
  // Next uses exceptions for redirects, not-found and static-render bailouts.
  unstable_rethrow(error);
  throw error;
}

export async function disposeServerRuntime() {
  await runtime.dispose();
}
