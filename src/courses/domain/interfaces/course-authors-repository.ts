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
  get(courseId: string): Promise<CourseAuthorModel[]>;
}
