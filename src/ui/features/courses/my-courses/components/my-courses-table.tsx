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
              <TableHead className="w-[100px] text-right">Favorito</TableHead>
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
                <TableCell className="text-right">
                  {course.isFavorite ? "Sí" : "No"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
