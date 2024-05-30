import { verifyEmailGuard } from "@/src/auth/ui/guards/verify-email-guard";
import { invalidIdGuard } from "@/src/common/ui/guards/invalid-id-guard";
import type { PropsWithIdParam } from "@/src/common/ui/models/props-with-id-param";
import { handlePromiseError } from "@/src/common/utils/handle-promise-error";
import { ProfilePage } from "@/src/profile/ui/components/profile-page";
import { fetchProfileById } from "@/src/profile/ui/fetch/fetch-profile-by-id";
import { getProfilePagePath } from "@/src/profile/ui/utils/get-profile-page-path";
import type { Metadata } from "next";
import { RedirectType, notFound, redirect } from "next/navigation";

export default async function ProfileByIdPage({
  params: { id },
}: PropsWithIdParam) {
  invalidIdGuard(id);

  const [profile] = await Promise.all([
    fetchProfileById(id),
    verifyEmailGuard(),
  ]);
  if (!profile) notFound();

  if (profile.handle)
    redirect(getProfilePagePath(profile), RedirectType.replace);
  return <ProfilePage profile={profile} />;
}

export async function generateMetadata({
  params: { id },
}: PropsWithIdParam): Promise<Metadata> {
  const profile = await handlePromiseError(fetchProfileById(id));
  return {
    title: profile?.displayName ?? "Mi perfil",
    description: profile?.bio,
  };
}
