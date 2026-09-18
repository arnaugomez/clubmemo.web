import * as Layer from "effect/Layer";
import {
  GetCoursePracticeCountUseCase,
  GetCoursePracticeCountUseCaseService,
} from "../domain/use-cases/get-course-practice-count-use-case";

export { GetCoursePracticeCountUseCaseService };
export const GetCoursePracticeCountUseCaseLive = Layer.effect(
  GetCoursePracticeCountUseCaseService,
  GetCoursePracticeCountUseCase.make,
);
