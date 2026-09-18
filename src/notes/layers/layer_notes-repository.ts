import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { DatabaseService } from "@/src/common/layers/layer_database-service";
import { NotesRepositoryImpl } from "../data/repositories/notes-repository-impl";
import { NotesRepository } from "../domain/interfaces/notes-repository";

export { NotesRepository };
export const NotesRepositoryLive = Layer.effect(
  NotesRepository,
  Effect.gen(function* () {
    return new NotesRepositoryImpl(yield* DatabaseService);
  }),
);
