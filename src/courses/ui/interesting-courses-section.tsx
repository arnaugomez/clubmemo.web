import type { ProfileModel } from "@/src/profile/domain/models/profile-model";
import { getProfilePagePath } from "@/src/profile/ui/utils/get-profile-page-path";
import { SearchX } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "../../common/ui/components/shadcn/ui/button";
import { Skeleton } from "../../common/ui/components/shadcn/ui/skeleton";
import { textStyles } from "../../common/ui/styles/text-styles";
import { cn } from "../../common/ui/utils/shadcn";
import { DiscoverCourseCard } from "../../discover/ui/components/discover-course-card";
import { fetchMyProfile } from "../../profile/ui/fetch/fetch-my-profile";
import type { DiscoverCourseModel } from "../domain/models/discover-course-model";
import { fetchInterestingCourses } from "./interesting-courses/fetch/fetch-interesting-courses";

export function InterestingCoursesSection() {
  return (
    <section className="px-4">
      <div className="mx-auto max-w-prose">
        <h2 className={cn(textStyles.h3)}>Te puede interesar</h2>
        <div className="h-4"></div>
        <Suspense fallback={<InterestingCoursesLoading />}>
          <InterestingCoursesLoader />
        </Suspense>
      </div>
    </section>
  );
}

function InterestingCoursesLoading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
    </div>
  );
}

async function InterestingCoursesLoader() {
  const profile = await fetchMyProfile();
  if (!profile) return null;
  const courses = await fetchInterestingCourses();
  return <InterestingCoursesLoaded courses={courses} profile={profile} />;
}

interface InterestingCoursesLoadedProps {
  courses: DiscoverCourseModel[];
  profile: ProfileModel;
}

function InterestingCoursesLoaded({
  courses,
  profile,
}: InterestingCoursesLoadedProps) {
  if (!courses.length)
    return <InterestingCoursesEmptyState profile={profile} />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {courses.map((course) => (
        <DiscoverCourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

interface InterestingCoursesEmptyStateProps {
  profile: ProfileModel;
}

async function InterestingCoursesEmptyState({
  profile,
}: InterestingCoursesEmptyStateProps) {
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-400 bg-slate-100 px-6 py-8">
      <SearchX className="mx-auto size-6 text-slate-700" />
      <div className="h-2" />
      <h3 className={cn(textStyles.h4, "mx-auto max-w-sm text-center")}>
        No hay resultados
      </h3>
      <div className="h-1" />
      <p className={cn(textStyles.muted, "mx-auto max-w-lg text-center")}>
        Añade intereses a tu perfil para recibir recomendaciones personalizadas.
      </p>
      <div className="h-4" />
      <div className="mx-auto flex max-w-min space-x-4">
        <Button asChild>
          <Link href={getProfilePagePath(profile)}>Ver mi perfil</Link>
        </Button>
      </div>
    </div>
  );
}
