import type { GetSessionUseCase } from "@/src/auth/domain/use-cases/get-session-use-case";
import { UserIsNotAdminError } from "../models/admin-errors";

export class CheckIsAdminUseCase {
  constructor(private readonly getSessionUseCase: GetSessionUseCase) {}

  async execute(): Promise<void> {
    const { user } = await this.getSessionUseCase.execute();
    if (!user?.isAdmin) throw new UserIsNotAdminError();
  }
}
