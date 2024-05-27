import { fetchSession } from "@/src/auth/ui/fetch/fetch-session";
import { locator } from "@/src/common/di/locator";
import { getProfilePagePath } from "@/src/profile/ui/utils/get-profile-page-path";
import { RedirectType, notFound, redirect } from "next/navigation";

export default async function MyProfilePage() {
  const { user } = await fetchSession();
  if (!user) notFound();

  const profilesRepository = await locator.ProfilesRepository();
  const profile = await profilesRepository.getByUserId(user.id);
  if (!profile) notFound();
  redirect(getProfilePagePath(profile), RedirectType.replace);
}
