import type { ProfilesRepository } from "@/src/profile/domain/interfaces/profiles-repository";
import {
  InvalidConfirmationError,
  UserDoesNotExistError,
} from "../errors/auth-errors";
import type { AuthService } from "../interfaces/auth-service";
import type { UsersRepository } from "../interfaces/users-repository";
import type { GetSessionUseCase } from "./get-session-use-case";

export class DeleteUserUseCase {
  constructor(
    private readonly getSessionUseCase: GetSessionUseCase,
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
    private readonly profilesRepository: ProfilesRepository,
  ) {}

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

    await this.profilesRepository.deleteByUserId(userId);
    await this.usersRepository.delete(userId);
    await this.authService.invalidateUserSessions(userId);
  }
}

interface DeleteUserUseCaseInputModel {
  password: string;
  confirmation: string;
}
