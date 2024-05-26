import { locator } from "@/src/common/locator";
import { invalidIdGuard } from "@/src/common/ui/guards/invalid-id-guard";
import type { PropsWithIdParam } from "@/src/common/ui/models/props-with-id-param";
import { ProfilePage } from "@/src/profile/ui/components/profile-page";
import { getProfilePagePath } from "@/src/profile/ui/utils/get-profile-page-path";
import { RedirectType, notFound, redirect } from "next/navigation";

export default async function ProfileByIdPage({
  params: { id },
}: PropsWithIdParam) {
  invalidIdGuard(id);

  const profilesRepository = await locator.ProfilesRepository();
  const profile = await profilesRepository.get(id);
  if (!profile) notFound();

  if (profile.handle)
    redirect(getProfilePagePath(profile), RedirectType.replace);
  return <ProfilePage profile={profile} />;
}
