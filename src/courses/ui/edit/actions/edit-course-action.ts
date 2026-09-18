"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { revalidatePath } from "next/cache";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { EditCourseUseCaseService } from "@/src/courses/layers/layer_edit-course-use-case";
import {
  type EditCourseActionModel,
  EditCourseActionSchema,
} from "../schemas/edit-course-action-schema";

export async function editCourseAction(input: EditCourseActionModel) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed = yield* Schema.decodeUnknownEffect(
              EditCourseActionSchema,
            )(input);

            const useCase = yield* EditCourseUseCaseService;
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
