import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import type { ProfilesRepository } from "@/src/profile/domain/interfaces/profiles-repository";
import type { CoursesRepository } from "../interfaces/courses-repository";
import type { DiscoverCourseModel } from "../models/discover-course-model";

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
