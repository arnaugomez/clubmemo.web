import { locator } from "@/src/common/locator";
import { ProfilePage } from "@/src/profile/ui/components/profile-page";
import { notFound } from "next/navigation";

export default async function ProfileByHandlePage({
  params: { handle },
}: {
  params: { handle: string };
}) {
  const profilesRepository = await locator.ProfilesRepository();
  const profile = await profilesRepository.getByHandle(handle);
  if (!profile) notFound();

  return <ProfilePage profile={profile} />;
}
