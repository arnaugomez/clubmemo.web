import { CourseModel } from "../models/course-model";
import { CreateCourseInputModel } from "../models/create-course-input-model";
import { GetCourseDetailInputModel } from "../models/get-course-detail-input-model";
import { UpdateCourseInputModel } from "../models/update-course-input-model";

export interface CoursesRepository {
  create(input: CreateCourseInputModel): Promise<CourseModel>;
  getDetail(input: GetCourseDetailInputModel): Promise<CourseModel | null>;
  update(input: UpdateCourseInputModel): Promise<void>;
}
