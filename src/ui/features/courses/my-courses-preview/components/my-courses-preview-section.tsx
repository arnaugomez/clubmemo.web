import { Button } from "@/src/ui/components/shadcn/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/ui/components/shadcn/ui/table";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { ArrowRight, Bookmark, Play } from "lucide-react";
import Link from "next/link";
import { CreateCourseButton } from "../../create/components/create-course-button";
import { fetchMyCoursesPreview } from "../fetch/fetch-my-courses-preview";

export function MyCoursesPreviewSection() {
  return (
    <section className="px-4">
      <div className="mx-auto max-w-prose">
        <div className="flex items-end">
          <h2 className={cn(textStyles.h2, "flex-1")}>Mis cursos</h2>
          <CreateCourseButton size="sm" />
        </div>
        {/* TODO: create reusable ocmponent for the link */}
        <Link
          href="/courses"
          className={cn(textStyles.mutedLink, "space-x-1 pt-1")}
        >
          <span>Ver todos</span>
          <ArrowRight size={16} className="inline" />
        </Link>
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
              className={cn(textStyles.small, "hover:underline truncate")}
            >
              <Link href={`/courses/detail/${course.courseId}`}>
                {course.name}
              </Link>
            </TableCell>
            <TableCell className="text-center">
              <Bookmark
                fill={course.isFavorite ? "currentColor" : "transparent"}
                className="mx-auto size-5"
              />
            </TableCell>
            <TableCell className="py-0 text-center">
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href={`/courses/detail/${course.courseId}/practice`}
                  className="text-slate-700"
                >
                  <Play className="size-5" />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
