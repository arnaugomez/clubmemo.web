import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import type { ExternalServiceError } from "@/src/common/effect/errors";
/**
 * Repository for course permissions
 *
 * Course permissions determine what a profile can do with a course. There are
 * three types of permissions: view permission, edit permission, and ownership
 * permission. The owner of a course can do anything with the course, including
 * deleting it.
 */
export interface CoursePermissionsRepository {
  /**
   * Deletes all the permissions related to a certain course
   *
   * @param courseId The id of a course
   */
  deleteByCourseId(courseId: string): Effect.Effect<void, ExternalServiceError>;
}

export const CoursePermissionsRepository =
  Context.Service<CoursePermissionsRepository>(
    "clubmemo/courses/domain/interfaces/course-permissions-repository/CoursePermissionsRepository",
  );
