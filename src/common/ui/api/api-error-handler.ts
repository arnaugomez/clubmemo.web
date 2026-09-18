import { captureError } from "@/src/common/effect/client-runtime";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import { NoPermissionError } from "../../domain/models/app-errors";
import { ActionResponse } from "../models/server-form-errors";

// biome-ignore lint/complexity/noStaticOnlyClass: utility class pattern
export class ApiErrorHandler {
  static handle(e: unknown) {
    if (e instanceof CourseDoesNotExistError) {
      return Response.json(
        ActionResponse.formGlobalError("profileDoesNotExist"),
        { status: 404 },
      );
    } else if (e instanceof NoPermissionError) {
      return Response.json(ActionResponse.formGlobalError("noPermission"), {
        status: 403,
      });
    }
    captureError(e);
    return new Response(e?.toString?.(), { status: 500 });
  }
}
