import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import type { ExternalServiceError } from "@/src/common/effect/errors";
import type { CourseAuthorModel } from "../models/course-author-model";

/**
 * Repository for course authors. The course authors are the profiles
 * that created the course or have edit permission.
 */
export interface CourseAuthorsRepository {
  /**
   * Returns the authors of a course i.e. the profiles that created the course
   * or have edit permission.
   * @returns The authors of the course
   */
  get(
    courseId: string,
  ): Effect.Effect<CourseAuthorModel[], ExternalServiceError>;
}

export const CourseAuthorsRepository = Context.Service<CourseAuthorsRepository>(
  "clubmemo/courses/domain/interfaces/course-authors-repository/CourseAuthorsRepository",
);
