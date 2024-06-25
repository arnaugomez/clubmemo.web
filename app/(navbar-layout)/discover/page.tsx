import { SearchEmptyState } from "@/src/common/ui/components/empty-state/search-empty-state";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import { DiscoverFiltersSection } from "@/src/discover/ui/components/discover-filters-section";
import { DiscoverLoadingSkeletons } from "@/src/discover/ui/components/discover-loading-skeletons";
import { DiscoverResultsSection } from "@/src/discover/ui/components/discover-results-section";
import { fetchDiscoverCourses } from "@/src/discover/ui/fetch/fetch-discover-courses";
import { Compass } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Explorar cursos",
};

/**
 * Page that contains a search bar and a list of search results. The search
 * results are a list of courses.
 */
export default async function DiscoverPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    retries?: string;
  };
}) {
  return (
    <main>
      <div className="h-20" />
      <div className="px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className={cn(textStyles.h2)}>
            <Compass className="mr-3 inline size-8 -translate-y-1" />
            Explorar cursos
          </h1>
          <div className="h-8" />
          <DiscoverFiltersSection />
          <div className="h-6"></div>
          <Suspense
            key={searchParams?.query ?? "" + searchParams?.retries ?? ""}
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
    return <SearchEmptyState />;
  }
  return <DiscoverResultsSection data={pagination} />;
}
