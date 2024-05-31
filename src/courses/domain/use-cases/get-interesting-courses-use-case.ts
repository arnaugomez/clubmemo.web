import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import type { ProfilesRepository } from "@/src/profile/domain/interfaces/profiles-repository";
import type { CoursesRepository } from "../interfaces/courses-repository";
import type { DiscoverCourseModel } from "../models/discover-course-model";

/**
 * Gets a list of recommended courses for the user, based on the interests
 * defined in their profile
 *
 * @param profileId The id of the profile to get the recommended courses
 * @throws {ProfileDoesNotExistError} When the user is not logged in
 * @returns A list of courses that might be interesting for the user
 */
export class GetInterestingCoursesUseCase {
  constructor(
    private readonly profilesRepository: ProfilesRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  async execute(profileId: string): Promise<DiscoverCourseModel[]> {
    const profile = await this.profilesRepository.get(profileId);
    if (!profile) throw new ProfileDoesNotExistError();

    return this.coursesRepository.getInterestingCourses({
      profileId,
      tags: profile.tags,
    });
  }
}
