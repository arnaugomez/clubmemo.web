import type { Lazy } from "../common/locator";
import { locator } from "../common/locator";
import { profileLocator } from "../profile/profile-locator";
import type { CopyCourseUseCase } from "./domain/use-cases/copy-course-use-case";
import type { CreateCourseUseCase } from "./domain/use-cases/create-course-use-case";
import type { DeleteCourseUseCase } from "./domain/use-cases/delete-course-use-case";
import type { EditCourseUploadUseCase } from "./domain/use-cases/edit-course-upload-use-case";
import type { EditCourseUseCase } from "./domain/use-cases/edit-course-use-case";
import type { FavoriteCourseUseCase } from "./domain/use-cases/favorite-course-use-case";
import type { GetInterestingCoursesUseCase } from "./domain/use-cases/get-interesting-courses-use-case";

interface CoursesLocator {
  EditCourseUseCase: Lazy<EditCourseUseCase>;
  CopyCourseUseCase: Lazy<CopyCourseUseCase>;
  GetInterestingCoursesUseCase: Lazy<GetInterestingCoursesUseCase>;
  CreateCourseUseCase: Lazy<CreateCourseUseCase>;
  DeleteCourseUseCase: Lazy<DeleteCourseUseCase>;
  FavoriteCourseUseCase: Lazy<FavoriteCourseUseCase>;
  EditCourseUploadUseCase: Lazy<EditCourseUploadUseCase>;
}

export const coursesLocator: CoursesLocator = {
  async EditCourseUseCase() {
    const file = await import("./domain/use-cases/edit-course-use-case");
    return new file.EditCourseUseCase(
      await profileLocator.GetMyProfileUseCase(),
      await locator.TagsRepository(),
      await locator.CoursesRepository(),
      await locator.FileUploadsRepository(),
    );
  },
  CopyCourseUseCase: async () => {
    const file = await import("./domain/use-cases/copy-course-use-case");
    return new file.CopyCourseUseCase(
      await locator.CoursesRepository(),
      await locator.NotesRepository(),
      await profileLocator.GetMyProfileUseCase(),
    );
  },
  GetInterestingCoursesUseCase: async () => {
    const file = await import(
      "./domain/use-cases/get-interesting-courses-use-case"
    );
    return new file.GetInterestingCoursesUseCase(
      await locator.ProfilesRepository(),
      await locator.CoursesRepository(),
    );
  },
  async CreateCourseUseCase() {
    const file = await import("./domain/use-cases/create-course-use-case");
    return new file.CreateCourseUseCase(
      await profileLocator.GetMyProfileUseCase(),
      await locator.CoursesRepository(),
    );
  },
  async DeleteCourseUseCase() {
    const file = await import("./domain/use-cases/delete-course-use-case");
    return new file.DeleteCourseUseCase(
      await profileLocator.GetMyProfileUseCase(),
      await locator.CoursesRepository(),
    );
  },
  async FavoriteCourseUseCase() {
    const file = await import("./domain/use-cases/favorite-course-use-case");
    return new file.FavoriteCourseUseCase(
      await profileLocator.GetMyProfileUseCase(),
      await locator.CourseEnrollmentsRepository(),
    );
  },
  async EditCourseUploadUseCase() {
    const file = await import("./domain/use-cases/edit-course-upload-use-case");
    return new file.EditCourseUploadUseCase(
      await profileLocator.GetMyProfileUseCase(),
      locator.RateLimitsRepository(),
      await locator.CoursesRepository(),
      await locator.FileUploadsRepository(),
    );
  },
};
