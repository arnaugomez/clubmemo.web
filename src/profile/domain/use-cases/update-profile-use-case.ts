import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { ProfilesRepository } from "@/src/profile/domain/interfaces/profiles-repository";
import { TagsRepository } from "@/src/tags/domain/interfaces/tags-repository";
import { ProfileDoesNotExistError } from "../errors/profile-errors";
import type { UpdateProfileInputModel } from "../models/update-profile-input-model";
import { GetMyProfileUseCase } from "./get-my-profile-use-case";

/**
 * Edits the data of the profile of the currently logged in user
 *
 * @param input The data of the profile that will be changed
 * @throws {ProfileDoesNotExistError} When the user is not logged in
 */
export class UpdateProfileUseCase extends Context.Service<UpdateProfileUseCase>()(
  "clubmemo/profile/domain/use-cases/update-profile-use-case",
  {
    make: Effect.gen(function* () {
      const getMyProfileUseCase = yield* GetMyProfileUseCase;
      const tagsRepository = yield* TagsRepository;
      const profilesRepository = yield* ProfilesRepository;
      const execute = Effect.fn("UpdateProfileUseCase.execute")(function* (
        input: Omit<UpdateProfileInputModel, "id">,
      ) {
        const profile = yield* getMyProfileUseCase.execute();
        if (!profile) return yield* Effect.fail(new ProfileDoesNotExistError());

        yield* Effect.all(
          [
            tagsRepository.create(input.tags),
            profilesRepository.update({
              id: profile.id,
              ...input,
            }),
          ],
          { concurrency: "unbounded" },
        );
      });
      return { execute };
    }),
  },
) {}

export const UpdateProfileUseCaseService = UpdateProfileUseCase;
