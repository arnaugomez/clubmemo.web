import { DropdownMenuItem } from "@/src/common/ui/components/shadcn/ui/dropdown-menu";
import { CourseModel } from "@/src/courses/domain/models/course-model";
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
