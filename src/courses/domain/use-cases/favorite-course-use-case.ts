import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import type { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import type { CourseEnrollmentsRepository } from "../interfaces/course-enrollments-repository";

export class FavoriteCourseUseCase {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly courseEnrollmentsRepository: CourseEnrollmentsRepository,
  ) {}

  async execute({ courseId, isFavorite }: FavoriteCourseUseCaseInputModel) {
    const profile = await this.getMyProfileUseCase.execute();
    if (!profile) throw new ProfileDoesNotExistError();

    await this.courseEnrollmentsRepository.setFavorite({
      profileId: profile.id,
      courseId,
      isFavorite,
    });
  }
}

interface FavoriteCourseUseCaseInputModel {
  courseId: string;
  isFavorite: boolean;
}
