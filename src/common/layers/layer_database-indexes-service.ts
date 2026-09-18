import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { DatabaseService } from "@/src/common/layers/layer_database-service";
import { DatabaseIndexesServiceImpl } from "../data/services/database-indexes-service-impl";
import { DatabaseIndexesService } from "../domain/interfaces/database-indexes-service";

export { DatabaseIndexesService };
export const DatabaseIndexesServiceLive = Layer.effect(
  DatabaseIndexesService,
  Effect.gen(function* () {
    return new DatabaseIndexesServiceImpl(yield* DatabaseService);
  }),
);
