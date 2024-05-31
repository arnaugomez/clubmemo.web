import type { PaginationModel } from "@/src/common/domain/models/pagination-model";
import type { TokenPaginationModel } from "@/src/common/domain/models/token-pagination-model";
import type { CourseModel } from "../models/course-model";
import type { CreateCourseInputModel } from "../models/create-course-input-model";
import type { DiscoverCourseModel } from "../models/discover-course-model";
import type { EnrolledCourseListItemModel } from "../models/enrolled-course-list-item-model";
import type { GetCourseDetailInputModel } from "../models/get-course-detail-input-model";
import type { KeepLearningModel } from "../models/keep-learning-model";
import type { UpdateCourseInputModel } from "../models/update-course-input-model";

/**
 * Repository for courses.
 *
 * Each course is a collection of notes that teach a specific topic. Users
 * (profiles) can enroll a course to practice the cards and learn the topic.
 */
export interface CoursesRepository {
  /**
   * Creates a new course
   *
   * @param input The input data to create a course
   * @returns The created course
   */
  create(input: CreateCourseInputModel): Promise<CourseModel>;
  /**
   * Gets the detailed data of a course, including the enrollment of a profile
   * to that course.
   *
   * @param input The data to identify the course and its profile
   * @returns The detailed data of the course if the course exists, `null` otherwise
   */
  getDetail(input: GetCourseDetailInputModel): Promise<CourseModel | null>;
  /**
   * Updates the data of a course, changing its name, description, etc.
   *
   * @param input The new data of the course
   */
  update(input: UpdateCourseInputModel): Promise<void>;

  /**
   * Deletes a course permanently. Also deletes:
   * - Enrollments
   * - Permissions
   *
   * @param id The id of the course to delete
   */
  delete(id: string): Promise<void>;

  /**
   * Gets a list of courses matching a certain profile and params
   *
   * @param input The params or filters of the courses to get, including the
   * profile id
   * @returns A list of courses
   */
  getMyCourses(
    input: GetMyCoursesInputModel,
  ): Promise<EnrolledCourseListItemModel[]>;

  /**
   * Gets a paginated list of courses matching a certain profile and params
   *
   * @param input The params or filters of the courses to get, including the
   * profile id and pagination cursor
   * @returns A paginated list of courses
   */
  getMyCoursesPagination(
    input: GetMyCoursesPaginationInputModel,
  ): Promise<PaginationModel<EnrolledCourseListItemModel>>;

  /**
   * Gets whether a profile has courses or not
   *
   * @param profileId The id of the profile to check
   * @returns `true` if the profile has courses, `false` otherwise
   */
  getHasCourses(profileId: string): Promise<boolean>;

  /**
   * Gets a paginated list of courses that match a search query
   *
   * @param input The search query and pagination token
   * @returns A paginated list of courses that match the search query
   */
  getDiscoverCourses(
    input: GetDiscoverCoursesInputModel,
  ): Promise<TokenPaginationModel<DiscoverCourseModel>>;

  /**
   * Returns a paginated list of courses that have a certain author
   *
   * A profile is considered to be an author of a course if they have created
   * the course or have edit permissions on the course.
   *
   * @param input The params and filters to get the courses
   * @returns A paginated list of courses that have the author
   */
  getCoursesByAuthor(
    input: GetCoursesByAuthorInputModel,
  ): Promise<TokenPaginationModel<DiscoverCourseModel>>;

  /**
   * Gets a personalized recommendation of the course that a profile should keep
   * practicing.
   *
   * A profile can be enrolled to several courses and practice a handful of
   * their cards each day. If none of its courses have any more cards to
   * practice or learn on, this method returns `null`.
   *
   * @param profileId The id of the profile
   * @returns The recommended course to keep practicing, or `null` if there is
   * no course with cards to practice
   */
  getKeepLearning(profileId: string): Promise<KeepLearningModel | null>;

  /**
   * Gets a personalized list of courses that are interesting to a profile
   * and that the profile has not enrolled yet.
   *
   * A course is considered "interesting" to a profile if some of its tags
   * coincide with the tags of the profile. A tag is a keyword that describes
   * an interest or topic.
   *
   * @param input The profile id and tags of the profile
   * @returns A list of courses that are interesting to the profile and that
   * the profile is not enrolled in.
   */
  getInterestingCourses(
    input: GetInterestingCoursesInputModel,
  ): Promise<DiscoverCourseModel[]>;
}

export interface GetMyCoursesInputModel {
  profileId: string;
  isFavorite?: boolean;
  limit?: number;
}

export interface GetMyCoursesPaginationInputModel {
  profileId: string;
  isFavorite?: boolean;
  page?: number;
  pageSize?: number;
}

export interface GetDiscoverCoursesInputModel {
  query?: string;
  paginationToken?: string;
  limit?: number;
}

export interface GetCoursesByAuthorInputModel {
  profileId: string;
  paginationToken?: string;
  limit?: number;
}

export interface GetInterestingCoursesInputModel {
  profileId: string;
  tags: string[];
}
