import { Skeleton } from "@/src/ui/components/shadcn/ui/skeleton";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { BookmarkCheck, BookmarkX } from "lucide-react";
import { Suspense } from "react";
import { fetchFavoriteCourses } from "../fetch/fetch-favorite-courses";
import { FavoriteCourseCard } from "./favorite-course-card";

export function FavoriteCoursesSection() {
  return (
    <>
      <section className="px-4">
        <div className="mx-auto max-w-prose">
          <h2 className={cn(textStyles.h3, "mx-auto max-w-prose")}>
            Destacados
            <BookmarkCheck className="ml-2 inline size-6 -translate-y-[2px]" />
          </h2>
          <div className="h-4" />
          <Suspense fallback={<FavoriteCoursesLoadingSection />}>
            <FavoriteCoursesContent />
          </Suspense>
        </div>
      </section>
    </>
  );
}

async function FavoriteCoursesContent() {
  const results = await fetchFavoriteCourses();
  if (!results.length) {
    return <FavoriteCoursesEmptyState />;
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {results.map((course) => (
        <FavoriteCourseCard key={course.courseId} course={course} />
      ))}
    </div>
  );
}

function FavoriteCoursesLoadingSection() {
  return (
    <div className="grid h-48 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      <Skeleton className="h-48 rounded-lg" />
      <Skeleton className="h-48 rounded-lg" />
      <Skeleton className="hidden h-48 rounded-lg md:block" />
    </div>
  );
}

function FavoriteCoursesEmptyState() {
  return (
    <div className="flex h-28 flex-col items-center justify-center">
      <BookmarkX className="size-6 text-slate-500" />
      <div className="h-3"></div>
      <p className={textStyles.muted}>No hay resultados</p>
    </div>
  );
}
