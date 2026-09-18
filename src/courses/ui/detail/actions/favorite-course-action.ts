"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { revalidatePath } from "next/cache";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { FavoriteCourseUseCaseService } from "@/src/courses/layers/layer_favorite-course-use-case";
import type { FavoriteCourseActionModel } from "../schemas/favorite-course-action-schema";
import { FavoriteCourseActionSchema } from "../schemas/favorite-course-action-schema";

export async function favoriteCourseAction(input: FavoriteCourseActionModel) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed = yield* Schema.decodeUnknownEffect(
              FavoriteCourseActionSchema,
            )(input);
            const useCase = yield* FavoriteCourseUseCaseService;
            yield* useCase.execute(parsed);

            revalidatePath("/courses");
            revalidatePath("/learn");
          }),
        );
        if (Result.isFailure(outcome)) {
          const e = outcome.failure;
          return ActionErrorHandler.handle(e);
        }
      }
    }),
  );
}
