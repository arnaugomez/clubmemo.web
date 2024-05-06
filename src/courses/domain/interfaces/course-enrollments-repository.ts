import type { CourseEnrollmentModel } from "../models/course-enrollment-model";

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

export interface CourseEnrollmentsRepository {
  get(id: string): Promise<CourseEnrollmentModel | null>;
  create(input: CreateCourseEnrollmentInputModel): Promise<void>;
  setFavorite(input: SetCourseFavoriteInputModel): Promise<void>;
  delete(input: CreateCourseEnrollmentInputModel): Promise<void>;
  updateConfig(input: UpdateCourseEnrollmentConfigInputModel): Promise<void>;
}
