import { EnrolledCourseListItemModel } from "@/src/core/courses/domain/models/enrolled-course-list-item-model";
import { Card } from "@/src/ui/components/shadcn/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/ui/components/shadcn/ui/tooltip";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
interface FavoriteCourseCardProps {
  course: EnrolledCourseListItemModel;
}

export function FavoriteCourseCard({ course }: FavoriteCourseCardProps) {
  return (
    <Card className="h-48 overflow-clip">
      <div className="relative h-28 bg-slate-300">
        {course.picture && (
          <Image src={course.picture} layout="fill" alt="" objectFit="cover" />
        )}
      </div>
      <div className="p-3">
        <h3 className={cn(textStyles.h4, "truncate hover:underline")}>
          <Link href={`/courses/detail/${course.courseId}`}>{course.name}</Link>
        </h3>
        <div className="h-.5"></div>
        <FavoriteCourseCardPracticeSection course={course} />
      </div>
    </Card>
  );
}

function FavoriteCourseCardPracticeSection({
  course,
}: FavoriteCourseCardProps) {
  if (!course.shouldPractice) {
    return (
      <span className={cn(textStyles.muted, "")}>
        <Check className="mr-1 inline size-4 -translate-y-[1px]" /> Práctica
        terminada
      </span>
    );
  }
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Link
            href={`/courses/detail/${course.courseId}/practice`}
            className={cn(textStyles.muted, "group")}
          >
            <span className="group-hover:underline">Practicar</span>
            <ArrowRight className="ml-1 inline size-4 -translate-y-[1px]" />
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          Nuevo: {course.newCount} | Repasar: {course.dueCount}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
