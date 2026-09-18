import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { DatabaseService } from "@/src/common/layers/layer_database-service";
import { RateLimitsRepositoryImpl } from "../data/repositories/rate-limits-repository-impl";
import { RateLimitsRepository } from "../domain/interfaces/rate-limits-repository";

export { RateLimitsRepository };
export const RateLimitsRepositoryLive = Layer.effect(
  RateLimitsRepository,
  Effect.gen(function* () {
    return new RateLimitsRepositoryImpl(yield* DatabaseService);
  }),
);
