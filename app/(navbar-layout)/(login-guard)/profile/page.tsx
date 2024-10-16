import { fetchSession } from "@/src/auth/ui/fetch/fetch-session";
import { locator_profiles_ProfilesRepository } from "@/src/profile/locators/locator_profiles-repository";
import { getProfilePagePath } from "@/src/profile/ui/utils/get-profile-page-path";
import { RedirectType, notFound, redirect } from "next/navigation";

/**
 * Route that redirects to the page of the profile of the current user
 */
export default async function MyProfilePage() {
  const { user } = await fetchSession();
  if (!user) notFound();

  const profilesRepository = locator_profiles_ProfilesRepository();
  const profile = await profilesRepository.getByUserId(user.id);
  if (!profile) notFound();
  redirect(getProfilePagePath(profile), RedirectType.replace);
}
