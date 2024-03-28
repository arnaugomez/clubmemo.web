import { ProfileModel } from "@/src/core/profile/domain/models/profile-model";

interface ProfilePageProps {
  profile: ProfileModel;
}

export function ProfilePage({ profile }: ProfilePageProps) {
  return <>Profile {profile.id}</>;
}
