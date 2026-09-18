import * as Layer from "effect/Layer";
import {
  CopyCourseUseCase,
  CopyCourseUseCaseService,
} from "../domain/use-cases/copy-course-use-case";

export { CopyCourseUseCaseService };
export const CopyCourseUseCaseLive = Layer.effect(
  CopyCourseUseCaseService,
  CopyCourseUseCase.make,
);
