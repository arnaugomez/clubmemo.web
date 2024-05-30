import { ArrowLink } from "@/src/common/ui/components/button/arrow-link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/common/ui/components/shadcn/ui/table";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { CreateCourseButton } from "../../create/components/create-course-button";
import { PracticeCell } from "../../my-courses/components/practice-cell";
import { fetchMyCoursesPreview } from "../fetch/fetch-my-courses-preview";
import { getCourseDetailPath } from "../../utils/get-course-detail-path";

export function MyCoursesPreviewSection() {
  return (
    <section className="px-4">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end">
          <h2 className={cn(textStyles.h2, "flex-1")}>Mis cursos</h2>
          <CreateCourseButton size="sm" />
        </div>
        <ArrowLink href="/courses">Ver todos</ArrowLink>
        <div className="h-4"></div>
        <MyCoursesResultsSection />
      </div>
    </section>
  );
}

async function MyCoursesResultsSection() {
  const results = await fetchMyCoursesPreview();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead className="w-[110px] text-center">Destacado</TableHead>
          <TableHead className="w-[80px] text-right">Practicar</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((course) => (
          <TableRow key={course.courseId}>
            <TableCell
              className={cn(textStyles.small, "truncate hover:underline")}
            >
              <Link href={getCourseDetailPath(course.courseId)}>
                {course.name}
              </Link>
            </TableCell>
            <TableCell className="text-center">
              <Bookmark
                fill={course.isFavorite ? "currentColor" : "transparent"}
                className="mx-auto size-5"
              />
            </TableCell>
            <PracticeCell courseData={course.data} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
