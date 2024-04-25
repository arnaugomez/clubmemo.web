import { locator } from "@/src/common/locator";
import { invalidIdGuard } from "@/src/common/ui/guards/invalid-id-guard";
import { ProfilePage } from "@/src/profile/ui/components/profile-page";
import { RedirectType, notFound, redirect } from "next/navigation";

export default async function ProfileByIdPage({
  params: { id },
}: {
  params: { id: string };
}) {
  invalidIdGuard(id);

  const profilesRepository = await locator.ProfilesRepository();
  const profile = await profilesRepository.get(id);
  if (!profile) notFound();

  if (profile.handle)
    redirect(`/profile/${profile.handle}`, RedirectType.replace);
  return <ProfilePage profile={profile} />;
}
