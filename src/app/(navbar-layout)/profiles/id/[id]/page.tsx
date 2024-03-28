import { locator } from "@/src/core/app/locator";
import { ProfilePage } from "@/src/ui/features/profile/components/profile-page";
import { RedirectType, notFound, redirect } from "next/navigation";

export default async function ProfileByIdPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const profilesRepository = await locator.ProfilesRepository();
  const profile = await profilesRepository.get(id);
  console.log(profile);
  if (!profile) notFound();
  if (profile.handle)
    redirect(`/profiles/${profile.handle}`, RedirectType.replace);
  return <ProfilePage profile={profile} />;
}
