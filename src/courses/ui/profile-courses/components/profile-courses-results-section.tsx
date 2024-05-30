"use client";

import type { TokenPaginationModelData } from "@/src/common/domain/models/token-pagination-model";
import { TokenPaginationModel } from "@/src/common/domain/models/token-pagination-model";
import { waitMilliseconds } from "@/src/common/domain/utils/promises";
import { PaginationEmptyState } from "@/src/common/ui/components/empty-state/pagination-empty-state";
import { Skeleton } from "@/src/common/ui/components/shadcn/ui/skeleton";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import type { DiscoverCourseModelData } from "@/src/courses/domain/models/discover-course-model";
import { DiscoverCourseModel } from "@/src/courses/domain/models/discover-course-model";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { DiscoverCourseCard } from "../../../../discover/ui/components/discover-course-card";
import { paginateCoursesByAuthorAction } from "../actions/paginate-courses-by-author-action";

interface ProfileCoursesResultsSectionProps {
  profileId: string;
  data: TokenPaginationModelData<DiscoverCourseModelData>;
}

export function ProfileCoursesResultsSection({
  data,
  profileId,
}: ProfileCoursesResultsSectionProps) {
  const initialPagination = useMemo(
    () =>
      TokenPaginationModel.fromData(data, (e) => new DiscoverCourseModel(e)),
    [data],
  );
  const paginationToken = useRef(initialPagination.token);

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

    const result = await paginateCoursesByAuthorAction({
      profileId,
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
  }, [canLoadMore, isLoading, profileId, results]);

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
          Array.from({ length: 6 }).map((_, i) => (
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
