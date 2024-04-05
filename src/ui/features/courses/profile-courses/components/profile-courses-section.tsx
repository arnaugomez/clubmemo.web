import { ProfileModel } from "@/src/core/profile/domain/models/profile-model";
import { DiscoverLoadingSkeletons } from "@/src/ui/features/discover/components/discover-loading-skeletons";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { SearchX } from "lucide-react";
import { Suspense } from "react";
import { fetchCoursesByAuthor } from "../fetch/fetch-courses-by-author";
import { ProfileCoursesResultsSection } from "./profile-courses-results-section";

interface ProfileCoursesSectionProps {
  profile: ProfileModel;
}

export default async function ProfileCoursesSection({
  profile,
}: ProfileCoursesSectionProps) {
  return (
    <>
      <h2 className={cn(textStyles.h3)}>
        Cursos {profile.displayName && `de ${profile.displayName}`}
      </h2>
      <div className="h-1.5"></div>
      <p className={textStyles.muted}>
        En esta sección puedes ver los cursos que{" "}
        {profile.displayName ?? "el usuario"} ha publicado o editado
      </p>
      <div className="h-6"></div>
      <Suspense fallback={<DiscoverLoadingSkeletons />}>
        <ProfileCoursesContent profileId={profile.id} />
      </Suspense>
    </>
  );
}

interface ProfileCoursesContentProps {
  profileId: string;
}

async function ProfileCoursesContent({
  profileId,
}: ProfileCoursesContentProps) {
  const pagination = await fetchCoursesByAuthor({ profileId });
  if (pagination.results.length === 0) {
    return <ProfileCoursesEmptyState />;
  }
  return (
    <ProfileCoursesResultsSection profileId={profileId} data={pagination} />
  );
}

// TODO: create reusable component (also used in discover section)
function ProfileCoursesEmptyState() {
  return (
    <div className="h-64 flex flex-col items-center justify-center">
      <SearchX className="size-6 text-slate-500" />
      <div className="h-3"></div>
      <p className={textStyles.muted}>No hay resultados</p>
    </div>
  );
}
