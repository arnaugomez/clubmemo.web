"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { revalidatePath } from "next/cache";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { EditCourseConfigUseCaseService } from "@/src/courses/layers/layer_edit-course-config-use-case";
import type { EditCourseConfigActionModel } from "../schema/edit-course-config-action-schema";
import { EditCourseConfigActionSchema } from "../schema/edit-course-config-action-schema";

export async function editCourseConfigAction(
  data: EditCourseConfigActionModel,
) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed = yield* Schema.decodeUnknownEffect(
              EditCourseConfigActionSchema,
            )(data);

            const useCase = yield* EditCourseConfigUseCaseService;
            yield* useCase.execute(parsed);

            revalidatePath(`/courses/detail`);
            return ActionResponse.formSuccess(null);
          }),
        );
        if (Result.isFailure(outcome)) {
          const e = outcome.failure;
          return ActionErrorHandler.handle(e);
        } else {
          return outcome.success;
        }
      }
    }),
  );
}
