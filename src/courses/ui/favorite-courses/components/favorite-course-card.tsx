import { ArrowLink } from "@/src/common/ui/components/button/arrow-link";
import { Card } from "@/src/common/ui/components/shadcn/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/common/ui/components/shadcn/ui/tooltip";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import type { EnrolledCourseListItemModel } from "@/src/courses/domain/models/enrolled-course-list-item-model";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getCourseDetailPath } from "../../utils/get-course-detail-path";
interface FavoriteCourseCardProps {
  course: EnrolledCourseListItemModel;
}

export function FavoriteCourseCard({ course }: FavoriteCourseCardProps) {
  return (
    <Card className="h-48 overflow-clip">
      <div className="relative h-28 bg-slate-300">
        {course.picture && (
          <Image src={course.picture} alt="" fill className="object-cover" />
        )}
      </div>
      <div className="p-3">
        <h3 className={cn(textStyles.h4, "truncate hover:underline")}>
          <Link href={getCourseDetailPath(course.courseId)}>{course.name}</Link>
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
          <ArrowLink href={`/courses/detail/${course.courseId}/practice`}>
            Practicar
          </ArrowLink>
        </TooltipTrigger>
        <TooltipContent>
          Nuevo: {course.newCount} | Repasar: {course.dueCount}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
