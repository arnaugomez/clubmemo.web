"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { revalidatePath } from "next/cache";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { DeleteCourseUseCaseService } from "@/src/courses/layers/layer_delete-course-use-case";
import type { DeleteCourseActionModel } from "../schemas/delete-course-action-schema";
import { DeleteCourseActionSchema } from "../schemas/delete-course-action-schema";

export async function deleteCourseAction(input: DeleteCourseActionModel) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const { id } = yield* Schema.decodeUnknownEffect(
              DeleteCourseActionSchema,
            )(input);
            const useCase = yield* DeleteCourseUseCaseService;
            yield* useCase.execute(id);

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
