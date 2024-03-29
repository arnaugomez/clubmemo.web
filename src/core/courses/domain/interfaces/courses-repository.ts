import { CourseModel } from "../models/course-model";
import { CreateCourseInputModel } from "../models/create-course-input-model";

export interface CoursesRepository {
  create(input: CreateCourseInputModel): Promise<CourseModel>;
}
