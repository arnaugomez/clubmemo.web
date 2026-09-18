import * as Layer from "effect/Layer";
import {
  DeleteCourseUseCase,
  DeleteCourseUseCaseService,
} from "../domain/use-cases/delete-course-use-case";

export { DeleteCourseUseCaseService };
export const DeleteCourseUseCaseLive = Layer.effect(
  DeleteCourseUseCaseService,
  DeleteCourseUseCase.make,
);
