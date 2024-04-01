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

export interface CourseEnrollmentsRepository {
  create(input: CreateCourseEnrollmentInputModel): Promise<void>;
  setFavorite(input: CreateCourseEnrollmentInputModel): Promise<void>;
  delete(input: CreateCourseEnrollmentInputModel): Promise<void>;
}
