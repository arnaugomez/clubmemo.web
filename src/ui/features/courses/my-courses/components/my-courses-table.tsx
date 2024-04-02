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
import { Bookmark, Play } from "lucide-react";
import Link from "next/link";
import {
  FetchMyCoursesPaginationModel,
  fetchMyCoursesPagination,
} from "../fetch/fetch-my-courses";

interface MyCoursesTableProps {
  arg: FetchMyCoursesPaginationModel;
}
export async function MyCoursesTable({ arg }: MyCoursesTableProps) {
  const { results } = await fetchMyCoursesPagination(arg);
  return (
    <div className="px-4">
      <div className="mx-auto max-w-prose">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead className="w-[110px] text-center">Destacado</TableHead>
              <TableHead className="w-[80px] text-center">Practicar</TableHead>
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
      </div>
    </div>
  );
}
