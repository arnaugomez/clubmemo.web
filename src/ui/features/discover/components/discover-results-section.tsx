"use client";

import {
  TokenPaginationModel,
  TokenPaginationModelData,
} from "@/src/core/common/domain/models/token-pagination-model";
import { waitMilliseconds } from "@/src/core/common/utils/promises";
import {
  DiscoverCourseModel,
  DiscoverCourseModelData,
} from "@/src/core/courses/domain/models/discover-course-model";
import { Skeleton } from "@/src/ui/components/shadcn/ui/skeleton";
import { FormResponseHandler } from "@/src/ui/models/server-form-errors";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
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
        {canLoadMore && (
          <div key="inView" ref={ref}>
            <Skeleton key="inView" className="h-64 rounded-lg" />
          </div>
        )}
        {canLoadMore &&
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
      </div>
      {!canLoadMore && (
        <>
          <div className="flex justify-center pt-16">
            <Search className={cn(textStyles.muted, "size-5")} />
          </div>
          <div className="h-4"></div>
          <p className={cn(textStyles.muted, "text-center text-sm")}>
            No hay más resultados
          </p>
        </>
      )}
    </>
  );
}
