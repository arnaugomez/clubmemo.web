import { PaginationSection } from "@/src/common/ui/components/pagination/pagination-section";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import { CreateCourseButton } from "@/src/courses/ui/create/components/create-course-button";
import { CreateCourseCtaLarge } from "@/src/courses/ui/create/components/create-course-cta-large";
import { MyCoursesTable } from "@/src/courses/ui/my-courses/components/my-courses-table";
import { fetchHasCourses } from "@/src/courses/ui/my-courses/fetch/fetch-has-courses";
import type { FetchMyCoursesPaginationModel } from "@/src/courses/ui/my-courses/fetch/fetch-my-courses";
import { fetchMyCoursesPagination } from "@/src/courses/ui/my-courses/fetch/fetch-my-courses";
import { fetchMyProfile } from "@/src/profile/ui/fetch/fetch-my-profile";
import { BookText, GraduationCap } from "lucide-react";
import { Suspense } from "react";

export default function CoursesPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  const page = Number(searchParams?.page) || 1;

  return (
    <main>
      <div className="h-20" />
      <div className="px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className={cn(textStyles.h2)}>
            <BookText className="mr-2 inline size-7 -translate-y-1" />
            Mis cursos
          </h1>
        </div>
      </div>
      <div className="h-10" />
      <CoursesPageContent page={page} />
    </main>
  );
}

interface CoursesPageContentProps {
  page: number;
}

async function CoursesPageContent({ page }: CoursesPageContentProps) {
  const profile = await fetchMyProfile();
  if (!profile) {
    return null;
  }
  const hasCourses = await fetchHasCourses(profile.id);

  if (!hasCourses) {
    return <CreateCourseCtaLarge />;
  }

  const arg: FetchMyCoursesPaginationModel = { page };

  return (
    <>
      <div className="px-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex">
            <div className="flex-1"></div>
            <CreateCourseButton size="sm" />
          </div>
        </div>
      </div>
      <div className="h-4"></div>
      <Suspense key={arg.page} fallback={<MyCoursesLoading />}>
        <MyCoursesTable arg={arg} />
      </Suspense>
      <div className="h-8"></div>
      <Suspense>
        <CoursesPagePagination arg={arg} />
      </Suspense>
    </>
  );
}

interface CoursesPagePaginationProps {
  arg: FetchMyCoursesPaginationModel;
}

async function CoursesPagePagination({ arg }: CoursesPagePaginationProps) {
  const { totalCount: count } = await fetchMyCoursesPagination(arg);

  return <PaginationSection resultsCount={count} pageSize={10} />;
}

function MyCoursesLoading() {
  return (
    <div className="flex h-96 flex-col items-center justify-center space-y-2">
      <GraduationCap className="text-primary-500 size-6 animate-pulse" />
      <p className={cn(textStyles.base, "animate-pulse text-center")}>
        Cargando cursos...
      </p>
    </div>
  );
}
