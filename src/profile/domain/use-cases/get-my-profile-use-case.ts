import type { CheckSessionModel } from "@/src/auth/domain/models/check-session-model";
import type { ProfilesRepository } from "@/src/profile/domain/interfaces/profiles-repository";
import type { ProfileModel } from "../models/profile-model";

export class GetMyProfileUseCase {
  constructor(
    private readonly getSessionFn: () => Promise<CheckSessionModel>,
    private readonly profilesRepository: ProfilesRepository,
  ) {}

  async execute(): Promise<ProfileModel | null> {
    const { user } = await this.getSessionFn();
    if (!user) return null;
    return await this.profilesRepository.getByUserId(user.id);
  }
}
