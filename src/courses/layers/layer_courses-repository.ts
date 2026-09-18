import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { DatabaseService } from "@/src/common/layers/layer_database-service";
import { DateTimeService } from "@/src/common/layers/layer_datetime-service";
import { CoursesRepositoryImpl } from "../data/repositories/courses-repository-impl";
import { CoursesRepository } from "../domain/interfaces/courses-repository";

export { CoursesRepository };
export const CoursesRepositoryLive = Layer.effect(
  CoursesRepository,
  Effect.gen(function* () {
    return new CoursesRepositoryImpl(
      yield* DatabaseService,
      yield* DateTimeService,
    );
  }),
);
