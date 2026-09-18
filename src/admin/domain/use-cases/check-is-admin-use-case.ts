import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { GetSessionUseCase } from "@/src/auth/domain/use-cases/get-session-use-case";
import { UserIsNotAdminError } from "../models/admin-errors";

/**
 * Checks if the current user is an admin. If the user is not an admin, an error
 * is thrown.
 * @throws {UserIsNotAdminError} If the user is not an admin.
 * @returns {Promise<void>} If the user is an admin.
 */
export class CheckIsAdminUseCase extends Context.Service<CheckIsAdminUseCase>()(
  "clubmemo/admin/domain/use-cases/check-is-admin-use-case",
  {
    make: Effect.gen(function* () {
      const getSessionUseCase = yield* GetSessionUseCase;
      const execute = Effect.fn("CheckIsAdminUseCase.execute")(function* () {
        const { user } = yield* getSessionUseCase.execute();
        if (!user?.isAdmin)
          return yield* Effect.fail(new UserIsNotAdminError());
      });
      return { execute };
    }),
  },
) {}

export const CheckIsAdminUseCaseService = CheckIsAdminUseCase;
