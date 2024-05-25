import type { CoursesRepository } from "@/src/courses/domain/interfaces/courses-repository";
import type { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import { fetchPracticeCards } from "../../ui/fetch/fetch-practice-cards";
import type { PracticeCardModel } from "../models/practice-card-model";

export class GetNextPracticeCardsUseCase {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly coursesRepository: CoursesRepository,
  ) {}
  async execute(
    input: GetNextPracticeCardsInputModel,
  ): Promise<PracticeCardModel[]> {
    const profile = await this.getMyProfileUseCase.execute();
    if (!profile) return [];

    const course = await this.coursesRepository.getDetail({
      id: input.courseId,
      profileId: profile.id,
    });
    if (!course?.enrollment) return [];

    return await fetchPracticeCards({
      course,
      enrollment: course.enrollment,
    });
  }
}

export interface GetNextPracticeCardsInputModel {
  courseId: string;
}
