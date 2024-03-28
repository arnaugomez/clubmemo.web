import { locator } from "@/src/core/app/locator";
import { fetchSession } from "@/src/ui/features/auth/fetch/fetch-session";
import { RedirectType, notFound, redirect } from "next/navigation";

export default async function MyProfilePage() {
  const { user } = await fetchSession();
  if (!user) notFound();

  const profilesRepository = await locator.ProfilesRepository();
  const profile = await profilesRepository.getByUserId(user.id);
  if (!profile) notFound();
  if (profile.handle)
    redirect(`/profiles/${profile.handle}`, RedirectType.replace);
  return redirect(`/profiles/id/${profile.id}`, RedirectType.replace);
}
