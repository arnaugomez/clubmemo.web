import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { DatabaseService } from "@/src/common/layers/layer_database-service";
import { DateTimeService } from "@/src/common/layers/layer_datetime-service";
import { ReviewLogsRepositoryImpl } from "../data/repositories/review-logs-repository-impl";
import { ReviewLogsRepository } from "../domain/interfaces/review-logs-repository";

export { ReviewLogsRepository };
export const ReviewLogsRepositoryLive = Layer.effect(
  ReviewLogsRepository,
  Effect.gen(function* () {
    return new ReviewLogsRepositoryImpl(
      yield* DatabaseService,
      yield* DateTimeService,
    );
  }),
);
