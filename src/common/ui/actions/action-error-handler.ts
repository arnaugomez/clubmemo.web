import { UserDoesNotExistError } from "@/src/auth/domain/errors/auth-errors";
import {
  CannotEditCourseError,
  CourseDoesNotExistError,
} from "@/src/courses/domain/models/course-errors";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { ZodError } from "zod";
import { NoPermissionError } from "../../domain/models/app-errors";
import type { FormActionResponse } from "../models/server-form-errors";
import { ActionResponse } from "../models/server-form-errors";

export class ActionErrorHandler {
  static handle(e: unknown): FormActionResponse {
    if (e instanceof ProfileDoesNotExistError) {
      return ActionResponse.formGlobalError("profileDoesNotExist");
    } else if (e instanceof CourseDoesNotExistError) {
      return ActionResponse.formGlobalError("courseDoesNotExist");
    } else if (e instanceof CannotEditCourseError) {
      return ActionResponse.formGlobalError("cannotEditCourse");
    } else if (e instanceof NoPermissionError) {
      return ActionResponse.formGlobalError("noPermission");
    } else if (e instanceof UserDoesNotExistError) {
      return ActionResponse.formGlobalError("userDoesNotExist");
    } else if (e instanceof ZodError) {
      return ActionResponse.formZodError(e);
    } else {
      // TODO: log error report
      console.error(e);
      return ActionResponse.formGlobalError("general");
    }
  }
}
