import { ProfilesRepository } from "@/src/core/profile/domain/interfaces/profiles-repository";
import { AuthService } from "../interfaces/auth-service";
import { UsersRepository } from "../interfaces/users-repository";

export class DeleteUserUseCase {
  constructor(
    private authService: AuthService,
    private usersRepository: UsersRepository,
    private profilesRepository: ProfilesRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    await this.profilesRepository.deleteByUserId(userId);
    await this.usersRepository.delete(userId);
    await this.authService.invalidateUserSessions(userId);
  }
}
