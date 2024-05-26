import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/common/ui/components/shadcn/ui/avatar";
import type { ProfileModel } from "@/src/profile/domain/models/profile-model";
import { fetchMyProfile } from "@/src/profile/ui/fetch/fetch-my-profile";
import { getProfilePagePath } from "@/src/profile/ui/utils/get-profile-page-path";
import { User } from "lucide-react";
import Link from "next/link";
import { NavbarUserSectionLoggedOut } from "./navbar-user-session-logged-out";

export async function NavbarUserSection() {
  const profile = await fetchMyProfile();
  if (!profile) return <NavbarUserSectionLoggedOut />;

  return <NavbarUserSectionLoaded profile={profile} />;
}

interface NavbarUserSectionLoadedProps {
  profile?: ProfileModel;
}

export function NavbarUserSectionLoaded({
  profile,
}: NavbarUserSectionLoadedProps) {
  return (
    <Link href={profile ? getProfilePagePath(profile) : ""}>
      <span className="sr-only">Página de perfil</span>
      <Avatar>
        <AvatarImage src={profile?.picture} alt="Imagen de perfil" />
        <AvatarFallback className="text-slate-500 hover:bg-slate-200">
          <User />
        </AvatarFallback>
      </Avatar>
    </Link>
  );
}
