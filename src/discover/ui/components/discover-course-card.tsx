import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { Card } from "@/src/common/ui/components/shadcn/ui/card";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import type { DiscoverCourseModel } from "@/src/courses/domain/models/discover-course-model";
import { getCourseDetailPath } from "@/src/courses/ui/utils/get-course-detail-path";
import Image from "next/image";
import Link from "next/link";

interface DiscoverCourseCardProps {
  course: DiscoverCourseModel;
}

/**
 * Shows a summary of a search result (a course) in the Discover section.
 */
export function DiscoverCourseCard({ course }: DiscoverCourseCardProps) {
  return (
    <Card className="h-64 overflow-clip">
      <div className="relative h-24 bg-slate-300">
        {course.picture && (
          <Image
            src={course.picture}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        )}
      </div>
      <div className="p-3">
        <h3 className={cn(textStyles.h4, "truncate hover:underline")}>
          <Link href={getCourseDetailPath(course.id)}>{course.name}</Link>
        </h3>
        <div className="h-1"></div>
        <p className={cn(textStyles.base, "truncate")}>
          {course.description || "Sin descripción"}
        </p>
        <div className="h-1"></div>
        <DiscoverCourseCardTags tags={course.tags} />
        <div className="h-4"></div>
        <div className="flex justify-end space-x-3">
          <Button size="sm" variant="outline" className="w-full">
            <Link href={getCourseDetailPath(course.id)}>Ver curso</Link>
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
