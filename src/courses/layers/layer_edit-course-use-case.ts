import * as Layer from "effect/Layer";
import {
  EditCourseUseCase,
  EditCourseUseCaseService,
} from "../domain/use-cases/edit-course-use-case";

export { EditCourseUseCaseService };
export const EditCourseUseCaseLive = Layer.effect(
  EditCourseUseCaseService,
  EditCourseUseCase.make,
);
