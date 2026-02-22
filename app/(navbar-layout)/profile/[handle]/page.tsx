import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchSession } from "@/src/auth/ui/fetch/fetch-session";
import type { PropsWithHandleParam } from "@/src/common/ui/models/props-with-handle-param";
import { handlePromiseError } from "@/src/common/utils/handle-promise-error";
import { ProfilePage } from "@/src/profile/ui/components/profile-page";
import { fetchProfileByHandle } from "@/src/profile/ui/fetch/fetch-profile-by-handle";

/**
 * Gets the data of the profile with the given handle and shows the profile page
 */
export default async function ProfileByHandlePage(props: PropsWithHandleParam) {
  const { handle } = await props.params;
  const profile = await fetchProfileByHandle(handle);
  if (!profile) notFound();

  return <ProfilePage profile={profile} />;
}

/**
 * Returns the metadata of the HTML head for the profile page
 */
export async function generateMetadata(
  props: PropsWithHandleParam,
): Promise<Metadata> {
  const { handle } = await props.params;
  const profile = await handlePromiseError(fetchProfileByHandle(handle));
  if (!profile) return {};
  const { user } = await fetchSession();
  if (!profile.isPublic && profile.userId !== user?.id) {
    return {};
  }
  return {
    title: profile.displayName ?? "Mi perfil",
    description: profile.bio,
  };
}
