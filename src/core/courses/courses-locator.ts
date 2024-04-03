import { Lazy, locator } from "../app/locator";
import { UpdateCourseUseCase } from "./domain/use-cases/update-course-use-case";

interface CoursesLocator {
  UpdateCourseUseCase: Lazy<UpdateCourseUseCase>;
}

export const coursesLocator: CoursesLocator = {
  UpdateCourseUseCase: async () => {
    const file = await import("./domain/use-cases/update-course-use-case");
    return new file.UpdateCourseUseCase(
      await locator.TagsRepository(),
      await locator.CoursesRepository(),
    );
  },
};
