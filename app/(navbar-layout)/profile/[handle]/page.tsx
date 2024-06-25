import type { PropsWithHandleParam } from "@/src/common/ui/models/props-with-handle-param";
import { handlePromiseError } from "@/src/common/utils/handle-promise-error";
import { ProfilePage } from "@/src/profile/ui/components/profile-page";
import { fetchProfileByHandle } from "@/src/profile/ui/fetch/fetch-profile-by-handle";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

/**
 * Gets the data of the profile with the given handle and shows the profile page
 */
export default async function ProfileByHandlePage({
  params: { handle },
}: PropsWithHandleParam) {
  const profile = await fetchProfileByHandle(handle);
  if (!profile) notFound();

  return <ProfilePage profile={profile} />;
}

/**
 * Returns the metadata of the HTML head for the profile page
 */
export async function generateMetadata({
  params: { handle },
}: PropsWithHandleParam): Promise<Metadata> {
  const profile = await handlePromiseError(fetchProfileByHandle(handle));
  return {
    title: profile?.displayName ?? "Mi perfil",
    description: profile?.bio,
  };
}
