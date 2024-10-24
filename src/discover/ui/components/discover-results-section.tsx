"use client";

import type { TokenPaginationModelData } from "@/src/common/domain/models/token-pagination-model";
import { TokenPaginationModel } from "@/src/common/domain/models/token-pagination-model";
import { waitMilliseconds } from "@/src/common/domain/utils/promise";
import { locator_common_ErrorTrackingService } from "@/src/common/locators/locator_error-tracking-service";
import { PaginationEmptyState } from "@/src/common/ui/components/empty-state/pagination-empty-state";
import { Skeleton } from "@/src/common/ui/components/shadcn/ui/skeleton";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import type { DiscoverCourseModelData } from "@/src/courses/domain/models/discover-course-model";
import { DiscoverCourseModel } from "@/src/courses/domain/models/discover-course-model";
import range from "lodash/range";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import { paginateDiscoverAction } from "../actions/paginate-discover-action";
import { DiscoverCourseCard } from "./discover-course-card";

interface DiscoverResultsSectionProps {
  data: TokenPaginationModelData<DiscoverCourseModelData>;
}

export function DiscoverResultsSection({ data }: DiscoverResultsSectionProps) {
  const initialPagination = useMemo(
    () =>
      TokenPaginationModel.fromData(data, (e) => new DiscoverCourseModel(e)),
    [data],
  );
  const paginationToken = useRef(initialPagination.token);

  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.trim() ?? "";
  const [results, setResults] = useState(initialPagination.results);
  const [isLoading, setIsLoading] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(
    initialPagination.results.length === 12,
  );
  const { ref, inView } = useInView();

  const loadMore = useCallback(async () => {
    if (!canLoadMore) return;

    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await paginateDiscoverAction({
        query,
        paginationToken: paginationToken.current,
      });
      const handler = new FormResponseHandler(result);

      if (handler.hasErrors) {
        handler.toastErrors();
        await waitMilliseconds(1500);
      } else if (handler.data) {
        const newPagination = TokenPaginationModel.fromData(
          handler.data,
          (e) => new DiscoverCourseModel(e),
        );
        setResults(results.concat(newPagination.results));
        setCanLoadMore(newPagination.results.length === 12);
        paginationToken.current = newPagination.token;
      }
    } catch (error) {
      locator_common_ErrorTrackingService().captureError(error);
      toast.error("Error al cargar cursos");
      await waitMilliseconds(1500);
    }

    setIsLoading(false);
  }, [canLoadMore, isLoading, query, results]);

  useEffect(() => {
    if (!inView) return;
    loadMore();
  }, [inView, loadMore]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {results.map((course) => (
          <DiscoverCourseCard course={course} key={course.id} />
        ))}
        {canLoadMore &&
          range(6).map((_, i) => (
            <Skeleton
              key={i}
              ref={i ? undefined : ref}
              className="h-64 rounded-lg"
            />
          ))}
      </div>
      {!canLoadMore && <PaginationEmptyState />}
    </>
  );
}
