"use client";
import { PaginationSection } from "@/src/common/ui/components/pagination/pagination-section";
import { usePathname, useSearchParams } from "next/navigation";

export function MyCoursesPaginationSection({
  resultsCount,
}: {
  resultsCount: number;
}) {
  const params = useSearchParams();
  const page = Number(params.get("page")) || 1;
  const pathname = usePathname();

  function getHref(page: number) {
    const newParams = new URLSearchParams(params);
    newParams.set("page", page.toString());
    return `${pathname}?${newParams.toString()}`;
  }

  return (
    <PaginationSection
      resultsCount={resultsCount}
      pageSize={10}
      page={page}
      getHref={getHref}
    />
  );
}
