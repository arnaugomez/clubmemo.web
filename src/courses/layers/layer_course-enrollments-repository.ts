import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { DatabaseService } from "@/src/common/layers/layer_database-service";
import { CourseEnrollmentsRepositoryImpl } from "../data/repositories/course-enrollments-repository-impl";
import { CourseEnrollmentsRepository } from "../domain/interfaces/course-enrollments-repository";

export { CourseEnrollmentsRepository };
export const CourseEnrollmentsRepositoryLive = Layer.effect(
  CourseEnrollmentsRepository,
  Effect.gen(function* () {
    return new CourseEnrollmentsRepositoryImpl(yield* DatabaseService);
  }),
);
