import { notFound } from "next/navigation";
import type { ProfileModel } from "@/src/profile/domain/models/profile-model";
import { fetchSession } from "../../../auth/ui/fetch/fetch-session";

export async function privateProfileGuard(profile: ProfileModel) {
  const { user } = await fetchSession();
  if (!profile.isPublic && profile.userId !== user?.id) {
    notFound();
  }
}
