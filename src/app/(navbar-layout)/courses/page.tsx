import { PaginationSection } from "@/src/ui/components/pagination/pagination-section";
import { CreateCourseButton } from "@/src/ui/features/courses/create/components/create-course-button";
import { CreateCourseCtaLarge } from "@/src/ui/features/courses/create/components/create-course-cta-large";
import { MyCoursesTable } from "@/src/ui/features/courses/my-courses/components/my-courses-table";
import { fetchHasCourses } from "@/src/ui/features/courses/my-courses/fetch/fetch-has-courses";
import {
  FetchMyCoursesPaginationModel,
  fetchMyCoursesPagination,
} from "@/src/ui/features/courses/my-courses/fetch/fetch-my-courses";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { BookText } from "lucide-react";
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
        <div className="mx-auto max-w-prose">
          <h1 className={cn(textStyles.h2)}>
            <BookText className="inline size-7 -translate-y-1 mr-2" />
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
  const hasCourses = await fetchHasCourses();

  if (!hasCourses) {
    return <CreateCourseCtaLarge />;
  }

  const arg: FetchMyCoursesPaginationModel = { page };

  return (
    <>
      <div className="px-4">
        <div className="mx-auto max-w-prose">
          <div className="flex">
            <div className="flex-1"></div>
            <CreateCourseButton size="sm" />
          </div>
        </div>
      </div>
      <div className="h-4"></div>
      <Suspense key={arg.page} fallback={<Fallback />}>
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
  const pageSize = 10;

  return <PaginationSection resultsCount={count} pageSize={pageSize} />;
}

function Fallback() {
  return (
    <div className="px-4">
      <div className="mx-auto max-w-prose">Loading........</div>
    </div>
  );
}
