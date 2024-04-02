"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/ui/components/shadcn/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";

interface MyCoursesPaginationProps {
  resultsCount: number;
  pageSize?: number;
}

export function PaginationSection({
  resultsCount,
  pageSize = 10,
}: MyCoursesPaginationProps) {
  const pagesCount = Math.ceil(resultsCount / pageSize);
  const params = useSearchParams();
  const pathname = usePathname();

  function getPaginationLink(page: number) {
    const newParams = new URLSearchParams(params);
    newParams.set("page", page.toString());
    return `${pathname}?${newParams.toString()}`;
  }

  const page = Number(params.get("page")) || 1;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={getPaginationLink(1)} />
        </PaginationItem>

        {page > 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {page !== 1 && (
          <PaginationItem>
            <PaginationLink href={getPaginationLink(page - 1)}>
              {page - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink href={getPaginationLink(page)} isActive>
            {page}
          </PaginationLink>
        </PaginationItem>
        {page !== pagesCount && (
          <PaginationItem>
            <PaginationLink href={getPaginationLink(page + 1)}>
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {page < pagesCount - 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext href={getPaginationLink(pagesCount)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
