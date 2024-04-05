import { Lazy, locator } from "../app/locator";
import type { CopyCourseUseCase } from "./domain/use-cases/copy-course-use-case";
import type { UpdateCourseUseCase } from "./domain/use-cases/update-course-use-case";

interface CoursesLocator {
  UpdateCourseUseCase: Lazy<UpdateCourseUseCase>;
  CopyCourseUseCase: Lazy<CopyCourseUseCase>;
}

export const coursesLocator: CoursesLocator = {
  UpdateCourseUseCase: async () => {
    const file = await import("./domain/use-cases/update-course-use-case");
    return new file.UpdateCourseUseCase(
      await locator.TagsRepository(),
      await locator.CoursesRepository(),
    );
  },
  CopyCourseUseCase: async () => {
    const file = await import("./domain/use-cases/copy-course-use-case");
    return new file.CopyCourseUseCase(
      await locator.CoursesRepository(),
      await locator.NotesRepository(),
    );
  },
};
