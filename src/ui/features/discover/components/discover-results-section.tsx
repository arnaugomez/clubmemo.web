"use client";

import {
  DiscoverCourseModel,
  DiscoverCourseModelData,
} from "@/src/core/courses/domain/models/discover-course-model";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { Card } from "@/src/ui/components/shadcn/ui/card";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface DiscoverResultsSectionProps {
  results: DiscoverCourseModelData[];
}

export function DiscoverResultsSection({
  results: initialResults,
}: DiscoverResultsSectionProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [results, setResults] = useState(() =>
    initialResults.map((e) => new DiscoverCourseModel(e)),
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [canLoadMore, setCanLoadMore] = useState(initialResults.length === 12);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {results.map((course) => (
        <DiscoverCourseCard course={course} key={course.id} />
      ))}
    </div>
  );
}

interface DiscoverCourseCardProps {
  course: DiscoverCourseModel;
}

export function DiscoverCourseCard({ course }: DiscoverCourseCardProps) {
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
        <p className={cn(textStyles.muted, "truncate")}>
          #clubmemo #test #matematicas #hello
        </p>
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
