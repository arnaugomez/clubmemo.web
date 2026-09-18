import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import { runServer } from "@/src/common/effect/server-runtime";
import { ApiErrorHandler } from "@/src/common/ui/api/api-error-handler";
import type { PropsWithIdParam } from "@/src/common/ui/models/props-with-id-param";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import { CoursesRepository } from "@/src/courses/layers/layer_courses-repository";
import { NotesRepository } from "@/src/notes/layers/layer_notes-repository";
import { fetchMyProfile } from "@/src/profile/ui/fetch/fetch-my-profile";

/**
 * Returns a txt file with the notes of a course in Anki (plain text) format.
 */
export async function GET(_: Request, props: PropsWithIdParam) {
  return runServer(
    Effect.gen(function* () {
      const { id } = yield* Effect.tryPromise({
        try: () => props.params,
        catch: (error) => error,
      });
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const profile = yield* Effect.tryPromise({
              try: () => fetchMyProfile(),
              catch: (error) => error,
            });
            const coursesRepository = yield* CoursesRepository;
            const course = yield* coursesRepository.getDetail({
              id,
              profileId: profile?.id,
            });
            if (!course)
              return yield* Effect.fail(new CourseDoesNotExistError());
            if (!course.canView)
              return yield* Effect.fail(new NoPermissionError());
            const notesRepository = yield* NotesRepository;
            const rows = yield* notesRepository.getAllRows(id);
            const text = rows
              .map((row) =>
                [row.front, row.back]
                  .map((cell) => cell.replace('"', '""'))
                  .map((cell) => `"${cell}"\t`)
                  .join(""),
              )
              .map((row) => `${row}\n`)
              .join("");

            return new Response(text, {
              status: 200,
              headers: {
                "Content-Type": "text/plain",
                "Content-Disposition": "attachment; filename=anki.txt",
              },
            });
          }),
        );
        if (Result.isFailure(outcome)) {
          const e = outcome.failure;
          return ApiErrorHandler.handle(e);
        } else {
          return outcome.success;
        }
      }
    }),
  );
}
