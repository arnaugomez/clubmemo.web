import { ProfileModel } from "@/src/core/profile/domain/models/profile-model";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/ui/components/shadcn/ui/avatar";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { Edit2, Settings, User } from "lucide-react";
import Link from "next/link";
import { privateProfileGuard } from "../guards/private-profile-guard";

interface ProfilePageProps {
  profile: ProfileModel;
}

export async function ProfilePage({ profile }: ProfilePageProps) {
  await privateProfileGuard(profile);
  return (
    <main>
      <div className="h-40 bg-red-700" />
      <div className="px-4">
        <div className="mx-auto max-w-prose">
          <div className="flex justify-between">
            <div className="h-14 relative">
              <div className="absolute bottom-0 left-0 size-28 grid place-items-center bg-white rounded-full">
                <Avatar className="size-[104px]">
                  <AvatarImage alt="Imagen de perfil" />
                  <AvatarFallback className="text-slate-400 hover:bg-slate-200">
                    <User size={56} strokeWidth={1.5} />
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="flex space-x-4 items-end">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/settings">
                  <Settings />
                  <span className="sr-only">Ajustes</span>
                </Link>
              </Button>
              <Button variant="secondary">
                <Edit2 className="size-4 mr-3" /> Editar
              </Button>
            </div>
          </div>
          <div className="h-2" />
          <h1 className={textStyles.h2}>Mi perfil</h1>
          <div className="h-1" />
          <p className={textStyles.muted}>
            {!profile.isPublic && "Perfil privado - "}
            {profile.handle ? <>@{profile.handle}</> : "Sin identificador"}
          </p>
          {profile.bio && (
            <p className={cn(textStyles.p, "pt-2")}>{profile.bio}</p>
          )}
        </div>
      </div>
    </main>
  );
}
