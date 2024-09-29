import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/common/ui/components/shadcn/ui/pagination";

interface PaginationSectionProps {
  page: number;
  resultsCount: number;
  pageSize?: number;
  getHref: (page: number) => string;
}

export function PaginationSection({
  page,
  resultsCount,
  pageSize = 10,
  getHref,
}: PaginationSectionProps) {
  const pagesCount = Math.ceil(resultsCount / pageSize);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={getHref(1)} />
        </PaginationItem>

        {page > 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {page !== 1 && (
          <PaginationItem>
            <PaginationLink href={getHref(page - 1)}>{page - 1}</PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink href={getHref(page)} isActive>
            {page}
          </PaginationLink>
        </PaginationItem>
        {page !== pagesCount && (
          <PaginationItem>
            <PaginationLink href={getHref(page + 1)}>{page + 1}</PaginationLink>
          </PaginationItem>
        )}

        {page < pagesCount - 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext href={getHref(pagesCount)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
