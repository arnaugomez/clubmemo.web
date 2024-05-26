import {
  ForgotPasswordCodeExpiredError,
  SessionExpiredError,
  UserDoesNotExistError,
} from "@/src/auth/domain/errors/auth-errors";
import {
  CannotDeleteCourseError,
  CannotEditCourseError,
  CourseDoesNotExistError,
} from "@/src/courses/domain/models/course-errors";
import { EnrollmentDoesNotExistError } from "@/src/courses/domain/models/enrollment-errors";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { DailyRateLimitError } from "@/src/rate-limits/domain/errors/rate-limits-errors";
import { ZodError } from "zod";
import { NoPermissionError } from "../../domain/models/app-errors";
import type { FormActionResponse } from "../models/server-form-errors";
import { ActionResponse } from "../models/server-form-errors";
import { AiGeneratorEmptyMessageError, AiGeneratorError, AiGeneratorRateLimitError } from "@/src/ai-generator/domain/errors/ai-generator-errors";

export class ActionErrorHandler {
  static handle(e: unknown): FormActionResponse {
    if (e instanceof DailyRateLimitError) {
      return ActionResponse.formRateLimitError(e);
    } else if (e instanceof SessionExpiredError) {
      return ActionResponse.formGlobalError("sessionExpired");
    } else if (e instanceof ProfileDoesNotExistError) {
      return ActionResponse.formGlobalError("profileDoesNotExist");
    } else if (e instanceof CourseDoesNotExistError) {
      return ActionResponse.formGlobalError("courseDoesNotExist");
    } else if (e instanceof CannotEditCourseError) {
      return ActionResponse.formGlobalError("cannotEditCourse");
    } else if (e instanceof CannotDeleteCourseError) {
      return ActionResponse.formGlobalError("cannotDeleteCourse");
    } else if (e instanceof NoPermissionError) {
      return ActionResponse.formGlobalError("noPermission");
    } else if (e instanceof UserDoesNotExistError) {
      return ActionResponse.formGlobalError("userDoesNotExist");
    } else if (e instanceof ForgotPasswordCodeExpiredError) {
      return ActionResponse.formGlobalError("forgotPasswordCodeExpired");
    } else if (e instanceof EnrollmentDoesNotExistError) {
      return ActionResponse.formGlobalError("enrollmentDoesNotExist");
    } else if (e instanceof AiGeneratorEmptyMessageError) {
      return ActionResponse.formGlobalError("aiGeneratorEmptyMessage");
    } else if (e instanceof AiGeneratorError) {
      return ActionResponse.formGlobalError("aiGeneratorError");
    } else if (e instanceof AiGeneratorRateLimitError) {
      return ActionResponse.formGlobalError("aiGeneratorRateLimitError");
    } else if (e instanceof ZodError) {
      return ActionResponse.formZodError(e);
    } else {
      // TODO: log error report
      console.error(e);
      return ActionResponse.formGlobalError("general");
    }
  }
}
