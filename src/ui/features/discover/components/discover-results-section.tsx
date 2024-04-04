"use client";

import { waitMilliseconds } from "@/src/core/app/utils/promises";
import {
  DiscoverCourseModel,
  DiscoverCourseModelData,
} from "@/src/core/courses/domain/models/discover-course-model";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { Card } from "@/src/ui/components/shadcn/ui/card";
import { Skeleton } from "@/src/ui/components/shadcn/ui/skeleton";
import { FormResponseHandler } from "@/src/ui/models/server-form-errors";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { Plus, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { paginateDiscoverAction } from "../actions/paginate-discover-action";

interface DiscoverResultsSectionProps {
  results: DiscoverCourseModelData[];
}

export function DiscoverResultsSection({
  results: initialResults,
}: DiscoverResultsSectionProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.trim() ?? "";
  const [results, setResults] = useState(() =>
    initialResults.map((e) => new DiscoverCourseModel(e)),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(initialResults.length === 12);
  const { ref, inView } = useInView();

  const loadMore = useCallback(async () => {
    if (!canLoadMore) return;

    if (isLoading) return;
    setIsLoading(true);

    const result = await paginateDiscoverAction({
      query,
      paginationToken: results[results.length - 1].paginationToken,
    });
    const handler = new FormResponseHandler(result);

    if (handler.hasErrors) {
      handler.toastErrors();
      await waitMilliseconds(1500);
    } else if (handler.data) {
      setResults(
        results.concat(handler.data.map((e) => new DiscoverCourseModel(e))),
      );
      setCanLoadMore(handler.data.length === 12);
    }

    setIsLoading(false);
  }, [canLoadMore, isLoading, query, results]);

  useEffect(() => {
    if (!inView) return;
    loadMore();
  }, [inView, loadMore]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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

interface DiscoverCourseCardProps {
  course: DiscoverCourseModel;
}

function DiscoverCourseCard({ course }: DiscoverCourseCardProps) {
  return (
    <Card className="h-64 overflow-clip">
      <div className="relative h-24 bg-slate-300">
        {course.picture && (
          <Image src={course.picture} layout="fill" alt="" objectFit="cover" />
        )}
      </div>
      <div className="p-3">
        <h3 className={cn(textStyles.h4, "hover:underline truncate")}>
          <Link href={`/courses/detail/${course.id}`}>{course.name}</Link>
        </h3>
        <div className="h-1"></div>
        <p className={cn(textStyles.base, "truncate")}>
          {course.description || "Sin descripción"}
        </p>
        <div className="h-1"></div>
        <DiscoverCourseCardTags tags={course.tags} />
        <div className="h-4"></div>
        <div className="flex space-x-3 justify-end">
          <Button size="sm" variant={"secondary"}>
            <Link href={`/courses/detail/${course.id}`}>Ver</Link>
          </Button>
          <Button size="sm">
            <Plus className="size-5 mr-2" />
            <Link href={`/courses/detail/${course.id}`}>Unirme</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

interface DiscoverCourseCardTagsProps {
  tags: string[];
}

function DiscoverCourseCardTags({ tags }: DiscoverCourseCardTagsProps) {
  function getText() {
    if (tags.length) return tags.map((tag) => `#${tag}`).join(" ");
    return "Sin etiquetas";
  }
  return <p className={cn(textStyles.muted, "truncate")}>{getText()}</p>;
}
