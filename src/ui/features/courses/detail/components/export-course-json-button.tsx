import { CourseModel } from "@/src/core/courses/domain/models/course-model";
import { DropdownMenuItem } from "@/src/ui/components/shadcn/ui/dropdown-menu";
import { FileJson } from "lucide-react";

interface ExportCourseJsonButtonProps {
  course: CourseModel;
}
export function ExportCourseJsonButton({
  course,
}: ExportCourseJsonButtonProps) {
  return (
    <DropdownMenuItem asChild>
      <a href={`/courses/detail/${course.id}/export/json`} download>
        <FileJson className="mr-2 h-4 w-4" />
        <span>JSON</span>
      </a>
    </DropdownMenuItem>
  );
}
