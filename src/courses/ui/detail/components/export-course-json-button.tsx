import { DropdownMenuItem } from "@/src/common/ui/components/shadcn/ui/dropdown-menu";
import { CourseModel } from "@/src/courses/domain/models/course-model";
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
