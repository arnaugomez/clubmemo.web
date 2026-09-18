import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { DatabaseService } from "@/src/common/layers/layer_database-service";
import { EnvService } from "@/src/common/layers/layer_env-service";
import { AuthServiceImpl } from "../data/services/auth-service-impl";
import { AuthService } from "../domain/interfaces/auth-service";

export { AuthService };
export const AuthServiceLive = Layer.effect(
  AuthService,
  Effect.gen(function* () {
    return new AuthServiceImpl(yield* EnvService, yield* DatabaseService);
  }),
);
