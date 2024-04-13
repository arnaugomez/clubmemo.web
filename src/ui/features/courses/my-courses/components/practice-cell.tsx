"use client";
import {
  EnrolledCourseListItemModel,
  EnrolledCourseListItemModelData,
} from "@/src/core/courses/domain/models/enrolled-course-list-item-model";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { TableCell } from "@/src/ui/components/shadcn/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/ui/components/shadcn/ui/tooltip";
import { Check, Play } from "lucide-react";
import Link from "next/link";

interface PracticeCellProps {
  courseData: EnrolledCourseListItemModelData;
}
export function PracticeCell({ courseData }: PracticeCellProps) {
  const course = new EnrolledCourseListItemModel(courseData);
  function cellContent() {
    if (course.shouldPractice)
      return (
        <Button variant="ghost" size="sm" asChild>
          <Link
            href={`/courses/detail/${course.courseId}/practice`}
            className="text-slate-700"
          >
            <Play className="size-5" />
          </Link>
        </Button>
      );

    return (
      <div className="text-slate-700 h-9 grid place-content-center">
        <Check className="size-5" />
      </div>
    );
  }
  return (
    <TableCell className="py-0 text-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>{cellContent()}</TooltipTrigger>
          <TooltipContent>
            {course.shouldPractice
              ? `Nuevo: ${course.newCount} | Repasar: ${course.dueCount}`
              : "Práctica terminada"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  );
}
