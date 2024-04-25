import { fetchSession } from "@/src/auth/ui/fetch/fetch-session";
import { locator } from "@/src/common/locator";
import { RedirectType, notFound, redirect } from "next/navigation";

export default async function MyProfilePage() {
  const { user } = await fetchSession();
  if (!user) notFound();

  const profilesRepository = await locator.ProfilesRepository();
  const profile = await profilesRepository.getByUserId(user.id);
  if (!profile) notFound();
  if (profile.handle)
    redirect(`/profile/${profile.handle}`, RedirectType.replace);
  return redirect(`/profile/id/${profile.id}`, RedirectType.replace);
}
