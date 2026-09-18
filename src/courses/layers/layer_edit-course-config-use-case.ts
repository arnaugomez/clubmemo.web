import * as Layer from "effect/Layer";
import {
  EditCourseConfigUseCase,
  EditCourseConfigUseCaseService,
} from "../domain/use-cases/edit-course-config-use-case";

export { EditCourseConfigUseCaseService };
export const EditCourseConfigUseCaseLive = Layer.effect(
  EditCourseConfigUseCaseService,
  EditCourseConfigUseCase.make,
);
