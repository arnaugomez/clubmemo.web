"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { revalidatePath } from "next/cache";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { HandleAlreadyExistsError } from "@/src/profile/domain/errors/profile-errors";
import { UpdateProfileUseCaseService } from "@/src/profile/layers/layer_update-profile-use-case";
import type { EditProfileActionModel } from "../schemas/edit-profile-action-schema";
import { EditProfileActionSchema } from "../schemas/edit-profile-action-schema";

/**
 * Changes the data of the profile of the currently logged in user.
 * @param input The data of the profile that will be updated
 */
export async function editProfileAction(input: EditProfileActionModel) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed = yield* Schema.decodeUnknownEffect(
              EditProfileActionSchema,
            )(input);

            const updateProfileUseCase = yield* UpdateProfileUseCaseService;
            yield* updateProfileUseCase.execute(parsed);

            revalidatePath("/");
          }),
        );
        if (Result.isFailure(outcome)) {
          const e = outcome.failure;
          if (e instanceof HandleAlreadyExistsError) {
            return ActionResponse.formError("handle", {
              message: "El identificador ya está en uso",
              type: "handleAlreadyExists",
            });
          }
          ActionErrorHandler.handle(e);
        }
      }
    }),
  );
}
