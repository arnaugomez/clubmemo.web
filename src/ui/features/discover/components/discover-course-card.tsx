import { DiscoverCourseModel } from "@/src/core/courses/domain/models/discover-course-model";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { Card } from "@/src/ui/components/shadcn/ui/card";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
