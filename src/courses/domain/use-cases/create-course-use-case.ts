import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import type { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import type { CoursesRepository } from "../interfaces/courses-repository";

/**
 * Creates a new empty course
 *
 * @param input The input data to create a course, including the name of the course
 * @throws {ProfileDoesNotExistError} When the user is not logged in
 */
export class CreateCourseUseCase {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,

    private readonly coursesRepository: CoursesRepository,
  ) {}

  /**
   * Creates a new empty course
   *
   * @param input The input data to create a course, including the name of the course
   * @throws {ProfileDoesNotExistError} When the user is not logged in
   */
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
