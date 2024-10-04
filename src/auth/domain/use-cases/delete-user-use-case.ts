import type { ProfilesRepository } from "@/src/profile/domain/interfaces/profiles-repository";
import {
  InvalidConfirmationError,
  UserDoesNotExistError,
} from "../errors/auth-errors";
import type { AuthService } from "../interfaces/auth-service";
import type { UsersRepository } from "../interfaces/users-repository";
import type { GetSessionUseCase } from "./get-session-use-case";

/**
 * Deletes a user account. Before deleting the account, it checks if the
 * password is correct and if the confirmation text matches the user's email.
 * It deletes the user's profile and the user itself.
 *
 * @param param0 The user's password and the confirmation email
 */
export class DeleteUserUseCase {
  constructor(
    private readonly getSessionUseCase: GetSessionUseCase,
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
    private readonly profilesRepository: ProfilesRepository,
  ) {}

  /**
   * Deletes a user account. Before deleting the account, it checks if the
   * password is correct and if the confirmation text matches the user's email.
   * It deletes the user's profile and the user itself.
   *
   * @param param0 The user's password and the confirmation email
   */
  async execute({
    password,
    confirmation,
  }: DeleteUserUseCaseInputModel): Promise<void> {
    const { user } = await this.getSessionUseCase.execute();
    if (!user) throw new UserDoesNotExistError();
    if (confirmation != user.email) throw new InvalidConfirmationError();

    const userId = user.id;

    await this.authService.checkPasswordIsCorrect({
      userId,
      password,
    });

    await Promise.all([
      this.profilesRepository.deleteByUserId(userId),
      this.usersRepository.delete(userId),
      this.authService.invalidateUserSessions(userId),
    ]);
  }
}

interface DeleteUserUseCaseInputModel {
  password: string;
  confirmation: string;
}
