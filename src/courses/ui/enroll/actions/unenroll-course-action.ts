"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { revalidatePath } from "next/cache";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { CourseEnrollmentsRepository } from "@/src/courses/layers/layer_course-enrollments-repository";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";
import type { UnenrollCourseActionModel } from "../schemas/unenroll-course-action-schema";
import { UnenrollCourseActionSchema } from "../schemas/unenroll-course-action-schema";

export async function unenrollCourseAction(input: UnenrollCourseActionModel) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const { courseId } = yield* Schema.decodeUnknownEffect(
              UnenrollCourseActionSchema,
            )(input);

            const profile = yield* Effect.tryPromise({
              try: () => fetchMyProfile(),
              catch: (error) => error,
            });
            if (!profile)
              return yield* Effect.fail(new ProfileDoesNotExistError());

            const courseEnrollmentsRepository =
              yield* CourseEnrollmentsRepository;
            yield* courseEnrollmentsRepository.delete({
              courseId,
              profileId: profile.id,
            });

            revalidatePath(`/courses`);
            revalidatePath(`/learn`);
          }),
        );
        if (Result.isFailure(outcome)) {
          const error = outcome.failure;
          return ActionErrorHandler.handle(error);
        }
      }
    }),
  );
}
