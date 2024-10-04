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
  deleteByCourseId(courseId: string): Promise<void>;
}
