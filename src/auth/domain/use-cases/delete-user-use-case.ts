import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { ProfilesRepository } from "@/src/profile/domain/interfaces/profiles-repository";
import {
  InvalidConfirmationError,
  UserDoesNotExistError,
} from "../errors/auth-errors";
import { AuthService } from "../interfaces/auth-service";
import { UsersRepository } from "../interfaces/users-repository";
import { GetSessionUseCase } from "./get-session-use-case";

/**
 * Deletes a user account. Before deleting the account, it checks if the
 * password is correct and if the confirmation text matches the user's email.
 * It deletes the user's profile and the user itself.
 *
 * @param param0 The user's password and the confirmation email
 */
export class DeleteUserUseCase extends Context.Service<DeleteUserUseCase>()(
  "clubmemo/auth/domain/use-cases/delete-user-use-case",
  {
    make: Effect.gen(function* () {
      const getSessionUseCase = yield* GetSessionUseCase;
      const authService = yield* AuthService;
      const usersRepository = yield* UsersRepository;
      const profilesRepository = yield* ProfilesRepository;
      const execute = Effect.fn("DeleteUserUseCase.execute")(function* ({
        password,
        confirmation,
      }: DeleteUserUseCaseInputModel) {
        const { user } = yield* getSessionUseCase.execute();
        if (!user) return yield* Effect.fail(new UserDoesNotExistError());
        if (confirmation !== user.email)
          return yield* Effect.fail(new InvalidConfirmationError());

        const userId = user.id;

        yield* authService.checkPasswordIsCorrect({
          userId,
          password,
        });

        yield* Effect.all(
          [
            profilesRepository.deleteByUserId(userId),
            usersRepository.delete(userId),
            authService.invalidateUserSessions(userId),
          ],
          { concurrency: "unbounded" },
        );
      });
      return { execute };
    }),
  },
) {}

interface DeleteUserUseCaseInputModel {
  password: string;
  confirmation: string;
}

export const DeleteUserUseCaseService = DeleteUserUseCase;
