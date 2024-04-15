import { SearchX } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "../../components/shadcn/ui/button";
import { Skeleton } from "../../components/shadcn/ui/skeleton";
import { textStyles } from "../../styles/text-styles";
import { cn } from "../../utils/shadcn";
import { DiscoverCourseCard } from "../discover/components/discover-course-card";
import { fetchMyProfile } from "../profile/fetch/fetch-my-profile";
import { fetchInterestingCourses } from "./interesting-courses/fetch/fetch-interesting-courses";

export function InterestingCoursesSection() {
  return (
    <section className="px-4">
      <div className="mx-auto max-w-prose">
        <h2 className={cn(textStyles.h3)}>Te puede interesar</h2>
        <div className="h-4"></div>
        <Suspense fallback={<InterestingCoursesLoader />}>
          <InterestingCoursesContent />
        </Suspense>
      </div>
    </section>
  );
}

function InterestingCoursesLoader() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
    </div>
  );
}

async function InterestingCoursesContent() {
  const interestingCourses = await fetchInterestingCourses();
  if (!interestingCourses.length) return <InterestingCoursesEmptyState />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {interestingCourses.map((course) => (
        <DiscoverCourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

async function InterestingCoursesEmptyState() {
  const profile = await fetchMyProfile();
  return (
    <div className="px-6 py-8 rounded-xl bg-slate-100 border-2 border-dashed border-slate-400">
      <SearchX className="mx-auto size-6 text-slate-700" />
      <div className="h-2" />
      <h3 className={cn(textStyles.h4, "text-center mx-auto max-w-sm")}>
        No hay resultados
      </h3>
      <div className="h-1" />
      <p className={cn(textStyles.muted, "text-center mx-auto max-w-lg")}>
        Añade intereses a tu perfil para recibir recomendaciones personalizadas.
      </p>
      <div className="h-4" />
      <div className="mx-auto max-w-min flex space-x-4">
        <Button asChild>
          <Link
            href={
              profile?.handle
                ? `/profile/${profile.handle}`
                : `/profile/id/${profile?.id}`
            }
          >
            Ver mi perfil
          </Link>
        </Button>
      </div>
    </div>
  );
}
