import { ProfileModel } from "@/src/core/profile/domain/models/profile-model";
import { privateProfileGuard } from "../guards/private-profile-guard";

interface ProfilePageProps {
  profile: ProfileModel;
}

export async function ProfilePage({ profile }: ProfilePageProps) {
  await privateProfileGuard(profile);
  return <>Profile {profile.id}</>;
}
