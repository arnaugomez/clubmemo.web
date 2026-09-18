import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { EnvService } from "@/src/common/layers/layer_env-service";
import { DatabaseServiceImpl } from "../data/services/database-service-impl";
import { DatabaseService } from "../domain/interfaces/database-service";

export { DatabaseService };
export const DatabaseServiceLive = Layer.effect(
  DatabaseService,
  Effect.gen(function* () {
    const env = yield* EnvService;
    return yield* Effect.acquireRelease(
      Effect.sync(() => new DatabaseServiceImpl(env)),
      (database) => Effect.promise(() => database.client.close()),
    );
  }),
);
