"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { revalidatePath } from "next/cache";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { CreateCourseUseCaseService } from "@/src/courses/layers/layer_create-course-use-case";
import type { CreateCourseActionModel } from "../schemas/create-course-action-schema";
import { CreateCourseActionSchema } from "../schemas/create-course-action-schema";

export async function createCourseAction(input: CreateCourseActionModel) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed = yield* Schema.decodeUnknownEffect(
              CreateCourseActionSchema,
            )(input);
            const useCase = yield* CreateCourseUseCaseService;
            const course = yield* useCase.execute(parsed);

            revalidatePath("/courses");
            revalidatePath("/learn");

            return ActionResponse.formSuccess(course.data);
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
