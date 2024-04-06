import { CourseModel } from "@/src/core/courses/domain/models/course-model";
import { DropdownMenuItem } from "@/src/ui/components/shadcn/ui/dropdown-menu";
import { FileSpreadsheet } from "lucide-react";

interface ExportCourseCsvButtonProps {
  course: CourseModel;
}
export function ExportCourseCsvButton({ course }: ExportCourseCsvButtonProps) {
  return (
    <DropdownMenuItem asChild>
      <a href={`/courses/detail/${course.id}/export/csv`} download>
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        <span>CSV</span>
      </a>
    </DropdownMenuItem>
  );
}
