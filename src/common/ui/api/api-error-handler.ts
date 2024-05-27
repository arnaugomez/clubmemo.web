import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import { NoPermissionError } from "../../domain/models/app-errors";
import { ActionResponse } from "../models/server-form-errors";
import { clientLocator } from "../../di/client-locator";

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
    clientLocator.ErrorTrackingService().captureError(e);
    return new Response(e?.toString?.(), { status: 500 });
  }
}
