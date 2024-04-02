import { PaginationModel } from "@/src/core/app/domain/models/pagination-model";
import { CourseModel } from "../models/course-model";
import { CreateCourseInputModel } from "../models/create-course-input-model";
import { DiscoverCourseModel } from "../models/discover-course-model";
import { EnrolledCourseListItemModel } from "../models/enrolled-course-list-item-model";
import { GetCourseDetailInputModel } from "../models/get-course-detail-input-model";
import { UpdateCourseInputModel } from "../models/update-course-input-model";

export interface GetMyCoursesInputModel {
  profileId: string;
  isFavorite?: boolean;
  limit?: number;
}
export interface GetHasCoursesInputModel {
  profileId: string;
}

export interface GetMyCoursesPaginationInputModel {
  profileId: string;
  isFavorite?: boolean;
  page?: number;
  pageSize?: number;
}

export interface GetDiscoverCoursesInputModel {
  paginationToken?: string;
  query?: string;
  limit?: number;
}

export interface CoursesRepository {
  create(input: CreateCourseInputModel): Promise<CourseModel>;
  getDetail(input: GetCourseDetailInputModel): Promise<CourseModel | null>;
  update(input: UpdateCourseInputModel): Promise<void>;
  delete(id: string): Promise<void>;

  getMyCourses(
    input: GetMyCoursesInputModel,
  ): Promise<EnrolledCourseListItemModel[]>;

  getMyCoursesPagination(
    input: GetMyCoursesPaginationInputModel,
  ): Promise<PaginationModel<EnrolledCourseListItemModel>>;

  getHasCourses(input: GetHasCoursesInputModel): Promise<boolean>;

  getDiscoverCourses(
    input: GetDiscoverCoursesInputModel,
  ): Promise<DiscoverCourseModel[]>;
}
