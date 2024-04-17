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
import { Bookmark } from "lucide-react";
import Link from "next/link";
import {
  FetchMyCoursesPaginationModel,
  fetchMyCoursesPagination,
} from "../fetch/fetch-my-courses";
import { PracticeCell } from "./practice-cell";

interface MyCoursesTableProps {
  arg: FetchMyCoursesPaginationModel;
}
export async function MyCoursesTable({ arg }: MyCoursesTableProps) {
  const { results } = await fetchMyCoursesPagination(arg);
  return (
    <div className="px-4">
      <div className="mx-auto max-w-3xl">
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
                  className={cn(textStyles.small, "truncate hover:underline")}
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
                {/* TODO: Extract component */}
                <PracticeCell courseData={course.data} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
