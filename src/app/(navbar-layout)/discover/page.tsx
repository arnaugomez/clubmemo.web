import { locator } from "@/src/core/app/locator";
import { DiscoverFiltersSection } from "@/src/ui/features/discover/components/discover-filters-section";
import { DiscoverLoadingSkeletons } from "@/src/ui/features/discover/components/discover-loading-skeletons";
import { DiscoverResultsSection } from "@/src/ui/features/discover/components/discover-results-section";
import { fetchDiscoverCourses } from "@/src/ui/features/discover/fetch/fetch-discover-courses";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { Compass, SearchX } from "lucide-react";
import { Suspense } from "react";

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const coursesRepository = await locator.CoursesRepository();
  coursesRepository.getDiscoverCourses({});
  return (
    <main>
      <div className="h-20" />
      <div className="px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className={cn(textStyles.h2)}>
            {/* TODO: add cool animation to compass icon when page starts */}
            <Compass className="inline size-8 -translate-y-1 mr-3" />
            Explorar cursos
          </h1>
          <div className="h-8" />
          <DiscoverFiltersSection />
          <div className="h-6"></div>
          <Suspense
            key={searchParams?.query}
            fallback={<DiscoverLoadingSkeletons />}
          >
            <DiscoverPageContent query={searchParams?.query} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

interface DiscoverPageContentProps {
  query?: string;
}

async function DiscoverPageContent({ query }: DiscoverPageContentProps) {
  const pagination = await fetchDiscoverCourses({ query });
  if (pagination.results.length === 0) {
    return <DiscoverEmptyState />;
  }
  return <DiscoverResultsSection data={pagination} />;
}
function DiscoverEmptyState() {
  return (
    <div className="h-64 flex flex-col items-center justify-center">
      <SearchX className="size-6 text-slate-500" />
      <div className="h-3"></div>
      <p className={textStyles.muted}>No hay resultados</p>
    </div>
  );
}
