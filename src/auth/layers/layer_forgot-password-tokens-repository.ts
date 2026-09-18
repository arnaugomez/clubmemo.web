import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { DatabaseService } from "@/src/common/layers/layer_database-service";
import { ForgotPasswordTokensRepositoryImpl } from "../data/repositories/forgot-password-tokens-repository-impl";
import { ForgotPasswordTokensRepository } from "../domain/interfaces/forgot-password-tokens-repository";

export { ForgotPasswordTokensRepository };
export const ForgotPasswordTokensRepositoryLive = Layer.effect(
  ForgotPasswordTokensRepository,
  Effect.gen(function* () {
    return new ForgotPasswordTokensRepositoryImpl(yield* DatabaseService);
  }),
);
