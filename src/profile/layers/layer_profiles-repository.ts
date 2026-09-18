import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { DatabaseService } from "@/src/common/layers/layer_database-service";
import { ProfilesRepositoryImpl } from "../data/repositories/profiles-repository-impl";
import { ProfilesRepository } from "../domain/interfaces/profiles-repository";

export { ProfilesRepository };
export const ProfilesRepositoryLive = Layer.effect(
  ProfilesRepository,
  Effect.gen(function* () {
    return new ProfilesRepositoryImpl(yield* DatabaseService);
  }),
);
