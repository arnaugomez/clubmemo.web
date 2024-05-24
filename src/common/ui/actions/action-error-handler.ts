import { UserDoesNotExistError } from "@/src/auth/domain/errors/auth-errors";
import { ZodError } from "zod";
import type { FormActionResponse } from "../models/server-form-errors";
import { ActionResponse } from "../models/server-form-errors";

export class ActionErrorHandler {
  static handle(e: unknown): FormActionResponse {
    if (e instanceof UserDoesNotExistError) {
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
