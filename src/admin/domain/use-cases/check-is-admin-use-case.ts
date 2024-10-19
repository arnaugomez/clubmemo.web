import type { GetSessionUseCase } from "@/src/auth/domain/use-cases/get-session-use-case";
import { UserIsNotAdminError } from "../models/admin-errors";

/**
 * Checks if the current user is an admin. If the user is not an admin, an error
 * is thrown.
 * @throws {UserIsNotAdminError} If the user is not an admin.
 * @returns {Promise<void>} If the user is an admin.
 */
export class CheckIsAdminUseCase {
  constructor(private readonly getSessionUseCase: GetSessionUseCase) {}

  async execute(): Promise<void> {
    const { user } = await this.getSessionUseCase.execute();
    if (!user?.isAdmin) throw new UserIsNotAdminError();
  }
}
