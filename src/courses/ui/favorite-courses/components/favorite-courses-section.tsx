import { SearchEmptyState } from "@/src/common/ui/components/empty-state/search-empty-state";
import { Skeleton } from "@/src/common/ui/components/shadcn/ui/skeleton";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import type { EnrolledCourseListItemModel } from "@/src/courses/domain/models/enrolled-course-list-item-model";
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
          <Suspense fallback={<FavoriteCoursesLoading />}>
            <FavoriteCoursesLoader />
          </Suspense>
        </div>
      </section>
    </>
  );
}
function FavoriteCoursesLoading() {
  return (
    <div className="grid h-48 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      <Skeleton className="h-48 rounded-lg" />
      <Skeleton className="h-48 rounded-lg" />
      <Skeleton className="hidden h-48 rounded-lg md:block" />
    </div>
  );
}

async function FavoriteCoursesLoader() {
  const results = await fetchFavoriteCourses();
  if (!results.length) {
    return <FavoriteCoursesEmptyState />;
  }
  return <FavoriteCoursesLoaded courses={results} />;
}

function FavoriteCoursesEmptyState() {
  return (
    <SearchEmptyState icon={<BookmarkX className="size-6 text-slate-500" />} />
  );
}

interface FavoriteCoursesLoadedProps {
  courses: EnrolledCourseListItemModel[];
}

function FavoriteCoursesLoaded({ courses }: FavoriteCoursesLoadedProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {courses.map((course) => (
        <FavoriteCourseCard key={course.courseId} course={course} />
      ))}
    </div>
  );
}
