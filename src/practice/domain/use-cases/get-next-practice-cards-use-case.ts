import type { CoursesRepository } from "@/src/courses/domain/interfaces/courses-repository";
import type { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import type { PracticeCardModel } from "../models/practice-card-model";
import type { GetPracticeCardsUseCase } from "./get-practice-cards-use-case";

export class GetNextPracticeCardsUseCase {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly coursesRepository: CoursesRepository,
    private readonly getPracticeCardsUseCase: GetPracticeCardsUseCase,
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

    return await this.getPracticeCardsUseCase.execute({
      course,
      enrollment: course.enrollment,
    });
  }
}

export interface GetNextPracticeCardsInputModel {
  courseId: string;
}
