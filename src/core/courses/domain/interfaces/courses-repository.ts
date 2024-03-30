import { CourseModel } from "../models/course-model";
import { CreateCourseInputModel } from "../models/create-course-input-model";
import { GetCourseDetailInputModel } from "../models/get-course-detail-input-model";

export interface CoursesRepository {
  create(input: CreateCourseInputModel): Promise<CourseModel>;
  getDetail(input: GetCourseDetailInputModel): Promise<CourseModel | null>;
}
