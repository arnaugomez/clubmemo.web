import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { DatabaseService } from "@/src/common/layers/layer_database-service";
import { DateTimeService } from "@/src/common/layers/layer_datetime-service";
import { PracticeCardsRepositoryImpl } from "../../practice/data/repositories/practice-cards-repository-impl";
import { PracticeCardsRepository } from "../domain/interfaces/practice-cards-repository";

export { PracticeCardsRepository };
export const PracticeCardsRepositoryLive = Layer.effect(
  PracticeCardsRepository,
  Effect.gen(function* () {
    return new PracticeCardsRepositoryImpl(
      yield* DatabaseService,
      yield* DateTimeService,
    );
  }),
);
