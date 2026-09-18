import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { DatabaseService } from "@/src/common/layers/layer_database-service";
import { CoursePermissionsRepositoryImpl } from "../data/repositories/course-permissions-repository-impl";
import { CoursePermissionsRepository } from "../domain/interfaces/course-permissions-repository";

export { CoursePermissionsRepository };
export const CoursePermissionsRepositoryLive = Layer.effect(
  CoursePermissionsRepository,
  Effect.gen(function* () {
    return new CoursePermissionsRepositoryImpl(yield* DatabaseService);
  }),
);
