import * as Layer from "effect/Layer";
import {
  CreateCourseUseCase,
  CreateCourseUseCaseService,
} from "../domain/use-cases/create-course-use-case";

export { CreateCourseUseCaseService };
export const CreateCourseUseCaseLive = Layer.effect(
  CreateCourseUseCaseService,
  CreateCourseUseCase.make,
);
