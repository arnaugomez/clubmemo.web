import { SearchEmptyState } from "@/src/common/ui/components/empty-state/search-empty-state";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import { DiscoverLoadingSkeletons } from "@/src/discover/ui/components/discover-loading-skeletons";
import type { ProfileModel } from "@/src/profile/domain/models/profile-model";
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
        En esta sección puedes ver los <strong>cursos públicos</strong> que{" "}
        {profile.displayName ?? "el usuario"} ha creado
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
    return <SearchEmptyState />;
  }
  return (
    <ProfileCoursesResultsSection profileId={profileId} data={pagination} />
  );
}
