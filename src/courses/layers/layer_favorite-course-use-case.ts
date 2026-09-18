import * as Layer from "effect/Layer";
import {
  FavoriteCourseUseCase,
  FavoriteCourseUseCaseService,
} from "../domain/use-cases/favorite-course-use-case";

export { FavoriteCourseUseCaseService };
export const FavoriteCourseUseCaseLive = Layer.effect(
  FavoriteCourseUseCaseService,
  FavoriteCourseUseCase.make,
);
