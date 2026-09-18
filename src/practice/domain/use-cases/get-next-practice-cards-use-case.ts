import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { CoursesRepository } from "@/src/courses/domain/interfaces/courses-repository";
import { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import { GetPracticeCardsUseCase } from "./get-practice-cards-use-case";

/**
 * Gets a list of the next practice cards that the current user should
 * practice for a course, after the current practice session is finished
 *
 * @param input an object containing the course id
 * @returns A list of practice cards that the user should practice. If the
 * user is not logged in or not enrolled in the course, returns an empty list.
 */
export class GetNextPracticeCardsUseCase extends Context.Service<GetNextPracticeCardsUseCase>()(
  "clubmemo/practice/domain/use-cases/get-next-practice-cards-use-case",
  {
    make: Effect.gen(function* () {
      const getMyProfileUseCase = yield* GetMyProfileUseCase;
      const coursesRepository = yield* CoursesRepository;
      const getPracticeCardsUseCase = yield* GetPracticeCardsUseCase;
      const execute = Effect.fn("GetNextPracticeCardsUseCase.execute")(
        function* (input: GetNextPracticeCardsInputModel) {
          const profile = yield* getMyProfileUseCase.execute();
          if (!profile) return [];

          const course = yield* coursesRepository.getDetail({
            id: input.courseId,
            profileId: profile.id,
          });
          if (!course?.enrollment) return [];

          return yield* getPracticeCardsUseCase.execute({
            course,
            enrollment: course.enrollment,
          });
        },
      );
      return { execute };
    }),
  },
) {}

export interface GetNextPracticeCardsInputModel {
  courseId: string;
}

export const GetNextPracticeCardsUseCaseService = GetNextPracticeCardsUseCase;
