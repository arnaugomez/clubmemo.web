import { ProfileModel } from "@/src/core/profile/domain/models/profile-model";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/ui/components/shadcn/ui/avatar";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { LinkIcon, Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { fetchSession } from "../../auth/fetch/fetch-session";
import { EditProfileSection } from "../edit/components/edit-profile-section";
import { privateProfileGuard } from "../guards/private-profile-guard";

interface ProfilePageProps {
  profile: ProfileModel;
}

export async function ProfilePage({ profile }: ProfilePageProps) {
  await privateProfileGuard(profile);
  return (
    <main>
      <div className="h-40 bg-slate-200 relative">
        {profile.backgroundPicture && (
          <Image
            fill={true}
            src={profile.backgroundPicture}
            alt=""
            className="object-cover"
          />
        )}
      </div>
      <div className="px-4">
        <div className="mx-auto max-w-prose">
          <div className="flex justify-between">
            <div className="h-14 relative">
              <div className="absolute bottom-0 left-0 size-28 grid place-items-center bg-white rounded-full">
                <Avatar className="size-[104px]">
                  <AvatarImage src={profile.picture} alt="Imagen de perfil" />
                  <AvatarFallback className="text-slate-400">
                    <User size={56} strokeWidth={1.5} />
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <Suspense>
              <ProfileButtonsSection profile={profile} />
            </Suspense>
          </div>
          <div className="h-2" />
          <h1 className={textStyles.h2}>
            {profile.displayName || "Mi perfil"}
          </h1>
          <div className="h-1" />
          <p className={textStyles.muted}>
            {!profile.isPublic && "Perfil privado - "}
            {profile.handle ? <>@{profile.handle}</> : "Sin identificador"}
          </p>
          {profile.bio && (
            <p className={cn(textStyles.p, "pt-6 whitespace-pre-line")}>
              {profile.bio}
            </p>
          )}
          {/* TODO: wrap into reusable link component */}
          {profile.website && (
            <a
              href={profile.website}
              className="pt-4 flex text-muted-foreground underline hover:text-slate-900 items-center max-w-xs"
            >
              <LinkIcon className="size-4 mr-2 flex-none" />
              <span className="text-sm truncate">
                {profile.website.replace(/(^\w+:|^)\/\//, "")}
              </span>
            </a>
          )}
        </div>
      </div>
    </main>
  );
}

async function ProfileButtonsSection({ profile }: ProfilePageProps) {
  const { user } = await fetchSession();
  if (profile.userId !== user?.id) {
    return null;
  }
  return (
    <div className="flex space-x-4 items-end">
      <Button
        className="group text-slate-500 hover:text-slate-900"
        variant="ghost"
        size="icon"
        asChild
      >
        <Link href="/settings">
          <Settings className="group-hover:animate-spin" />
          <span className="sr-only">Ajustes</span>
        </Link>
      </Button>
      <EditProfileSection profileData={profile.data} />
    </div>
  );
}
