import { WebsiteLink } from "@/src/common/ui/components/button/website-link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/common/ui/components/shadcn/ui/avatar";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import type { ProfileModel } from "@/src/profile/domain/models/profile-model";
import { Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { fetchSession } from "../../../auth/ui/fetch/fetch-session";
import ProfileCoursesSection from "../../../courses/ui/profile-courses/components/profile-courses-section";
import { TagsSection } from "../../../tags/ui/components/tags-section";
import { EditProfileSection } from "../edit/components/edit-profile-section";
import { privateProfileGuard } from "../guards/private-profile-guard";

interface ProfilePageProps {
  profile: ProfileModel;
}

/**
 * Page that displays the data of the profile and its published courses.
 *
 * It also contains links to edit the profile and the user settings.
 */
export async function ProfilePage({ profile }: ProfilePageProps) {
  await privateProfileGuard(profile);
  return (
    <main>
      <div className="relative h-40 bg-slate-200">
        {profile.backgroundPicture && (
          <Image
            fill={true}
            src={profile.backgroundPicture}
            alt=""
            className="object-cover"
            priority
            unoptimized
          />
        )}
      </div>
      <div className="px-4">
        <div className="mx-auto max-w-prose">
          <div className="flex justify-between">
            <div className="relative h-14">
              <div className="absolute bottom-0 left-0 grid size-28 place-items-center rounded-full bg-white">
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
            <p className={cn(textStyles.p, "whitespace-pre-line pt-6")}>
              {profile.bio}
            </p>
          )}
          {profile.website && <WebsiteLink url={profile.website} />}
          <TagsSection tags={profile.tags} />
          <div className="h-12"></div>
          <ProfileCoursesSection profile={profile} />
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
    <div className="flex items-end space-x-4">
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
