import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { DatabaseService } from "@/src/common/layers/layer_database-service";
import { CourseAuthorsRepositoryImpl } from "../data/repositories/course-authors-repository-impl";
import { CourseAuthorsRepository } from "../domain/interfaces/course-authors-repository";

export { CourseAuthorsRepository };
export const CourseAuthorsRepositoryLive = Layer.effect(
  CourseAuthorsRepository,
  Effect.gen(function* () {
    return new CourseAuthorsRepositoryImpl(yield* DatabaseService);
  }),
);
