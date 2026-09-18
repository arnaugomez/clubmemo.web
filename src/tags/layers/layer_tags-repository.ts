import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { DatabaseService } from "@/src/common/layers/layer_database-service";
import { TagsRepositoryImpl } from "../data/repositories/tags-repository-impl";
import { TagsRepository } from "../domain/interfaces/tags-repository";

export { TagsRepository };
export const TagsRepositoryLive = Layer.effect(
  TagsRepository,
  Effect.gen(function* () {
    return new TagsRepositoryImpl(yield* DatabaseService);
  }),
);
