import { CourseModel } from "@/src/core/courses/domain/models/course-model";
import { DropdownMenuItem } from "@/src/ui/components/shadcn/ui/dropdown-menu";
import { Star } from "lucide-react";

interface ExportCourseAnkiButtonProps {
  course: CourseModel;
}
export function ExportCourseAnkiButton({
  course,
}: ExportCourseAnkiButtonProps) {
  return (
    <DropdownMenuItem asChild>
      <a href={`/courses/detail/${course.id}/export/anki`} download>
        <Star className="mr-2 h-4 w-4" />
        <span>Anki</span>
      </a>
    </DropdownMenuItem>
  );
}
