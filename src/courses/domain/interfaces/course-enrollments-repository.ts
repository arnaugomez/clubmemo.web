import type { CourseEnrollmentModel } from "../models/course-enrollment-model";

/**
 * Repository for course enrollments.
 *
 * The course enrollments are relationships between profiles and courses. When a
 * profile signs up to a course, a course enrollment is created. Once a profile
 * is enrolled in a course, they can practice the course content, favorite the
 * course, and access it later in the "My courses" section.
 */
export interface CourseEnrollmentsRepository {
  /**
   * Get a course enrollment by its id
   *
   * @param id The id of the course enrollment
   * @returns The course enrollment or `null` if it does not exist
   */
  get(id: string): Promise<CourseEnrollmentModel | null>;
  /**
   * Create a new course enrollment. Enroll a profile in a course.
   *
   * @param input The input data to create a course enrollment, including the
   * course id and the profile id
   */
  create(input: CreateCourseEnrollmentInputModel): Promise<void>;

  /**
   * Sets a course as favorite or not for a profile. The data is stored in the
   * course enrollment.
   *
   * @param input The input data to set a course as favorite or not
   */
  setFavorite(input: SetCourseFavoriteInputModel): Promise<void>;

  /**
   * Unenrolls a profile from a course. Deletes the course enrollment.
   *
   * @param input The ids of the profile and the course
   */
  delete(input: CreateCourseEnrollmentInputModel): Promise<void>;

  /**
   * Deletes all the enrollments of a course
   *
   * @param courseId The id of a course
   */
  deleteByCourseId(courseId: string): Promise<void>;

  /**
   * Updates the configuration of a course enrollment. The configuration includes
   * the settings on how the course cards are practiced.
   *
   * @param input The new configuration
   */
  updateConfig(input: UpdateCourseEnrollmentConfigInputModel): Promise<void>;
}

export interface CreateCourseEnrollmentInputModel {
  courseId: string;
  profileId: string;
}

export interface SetCourseFavoriteInputModel {
  courseId: string;
  profileId: string;
  isFavorite: boolean;
}

export interface DeleteCourseEnrollmentInputModel {
  courseId: string;
  profileId: string;
}

export interface UpdateCourseEnrollmentConfigInputModel {
  enrollmentId: string;
  enableFuzz: boolean;
  maximumInterval: number;
  requestRetention: number;
  dailyNewCardsCount: number;
  showAdvancedRatingOptions: boolean;
}
