import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { DatabaseService } from "@/src/common/layers/layer_database-service";
import { UsersRepositoryImpl } from "../data/repositories/users-repository-impl";
import { UsersRepository } from "../domain/interfaces/users-repository";

export { UsersRepository };
export const UsersRepositoryLive = Layer.effect(
  UsersRepository,
  Effect.gen(function* () {
    return new UsersRepositoryImpl(yield* DatabaseService);
  }),
);
