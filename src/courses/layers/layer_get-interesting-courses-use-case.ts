import * as Layer from "effect/Layer";
import {
  GetInterestingCoursesUseCase,
  GetInterestingCoursesUseCaseService,
} from "../domain/use-cases/get-interesting-courses-use-case";

export { GetInterestingCoursesUseCaseService };
export const GetInterestingCoursesUseCaseLive = Layer.effect(
  GetInterestingCoursesUseCaseService,
  GetInterestingCoursesUseCase.make,
);
