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
            <BookmarkCheck className="inline size-6 -translate-y-[2px] ml-2" />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {results.map((course) => (
        <FavoriteCourseCard key={course.courseId} course={course} />
      ))}
    </div>
  );
}

function FavoriteCoursesLoadingSection() {
  return (
    <div className="h-48 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <Skeleton className="h-48 rounded-lg" />
      <Skeleton className="h-48 rounded-lg" />
      <Skeleton className="h-48 hidden md:block rounded-lg" />
    </div>
  );
}

function FavoriteCoursesEmptyState() {
  return (
    <div className="h-28 flex flex-col items-center justify-center">
      <BookmarkX className="size-6 text-slate-500" />
      <div className="h-3"></div>
      <p className={textStyles.muted}>No hay resultados</p>
    </div>
  );
}
