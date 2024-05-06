import type { ProfilesRepository } from "@/src/profile/domain/interfaces/profiles-repository";
import type { AuthService } from "../interfaces/auth-service";
import type { UsersRepository } from "../interfaces/users-repository";

export class DeleteUserUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
    private readonly profilesRepository: ProfilesRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    await this.profilesRepository.deleteByUserId(userId);
    await this.usersRepository.delete(userId);
    await this.authService.invalidateUserSessions(userId);
  }
}
