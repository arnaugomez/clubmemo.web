import { locator } from "@/src/core/common/locator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/ui/components/shadcn/ui/avatar";
import { User } from "lucide-react";
import Link from "next/link";
import { fetchSession } from "../../auth/fetch/fetch-session";

export async function NavbarUserSection() {
  const { user } = await fetchSession();
  if (!user) return <></>;

  const profilesRepository = await locator.ProfilesRepository();
  const profile = await profilesRepository.getByUserId(user.id);
  if (!profile) return <></>;

  return (
    <Link
      href={`/profile/${profile.handle ? profile.handle : `/id/${profile.id}`}`}
    >
      <span className="sr-only">Página de perfil</span>
      <Avatar>
        <AvatarImage src={profile.picture} alt="Imagen de perfil" />
        <AvatarFallback className="text-slate-500 hover:bg-slate-200">
          <User />
        </AvatarFallback>
      </Avatar>
    </Link>
  );
}
