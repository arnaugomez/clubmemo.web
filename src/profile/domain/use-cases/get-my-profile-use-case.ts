import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { GetSessionUseCase } from "@/src/auth/domain/use-cases/get-session-use-case";
import { ProfilesRepository } from "@/src/profile/domain/interfaces/profiles-repository";

/**
 * Gets the profile of the currently logged in user
 * @returns The profile of the currently logged in user, otherwise `null`
 */
export class GetMyProfileUseCase extends Context.Service<GetMyProfileUseCase>()(
  "clubmemo/profile/domain/use-cases/get-my-profile-use-case",
  {
    make: Effect.gen(function* () {
      const getSessionFn = (yield* GetSessionUseCase).execute;
      const profilesRepository = yield* ProfilesRepository;
      const execute = Effect.fn("GetMyProfileUseCase.execute")(function* () {
        const { user } = yield* getSessionFn();
        if (!user) return null;
        return yield* profilesRepository.getByUserId(user.id);
      });
      return { execute };
    }),
  },
) {}

export const GetMyProfileUseCaseService = GetMyProfileUseCase;
