import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import type { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import type { CoursesRepository } from "../interfaces/courses-repository";

export class CreateCourseUseCase {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,

    private readonly coursesRepository: CoursesRepository,
  ) {}
  async execute(input: CreateCourseInputModel) {
    const profile = await this.getMyProfileUseCase.execute();
    if (!profile) throw new ProfileDoesNotExistError();

    return await this.coursesRepository.create({
      name: input.name,
      profileId: profile.id,
    });
  }
}

interface CreateCourseInputModel {
  name: string;
}
