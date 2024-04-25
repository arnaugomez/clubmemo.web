import { CourseAuthorModel } from "../models/course-author-model";

export interface CourseAuthorsRepository {
  get(courseId: string): Promise<CourseAuthorModel[]>;
}
