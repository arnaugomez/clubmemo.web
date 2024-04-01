import { locator } from "@/src/core/app/locator";
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
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { fetchMyProfile } from "../../../profile/fetch/fetch-my-profile";
import { CreateCourseButton } from "../../create/components/create-course-button";

export function MyCoursesSection() {
  return (
    <section className="px-4">
      <div className="mx-auto max-w-prose">
        <div className="flex items-end">
          <h2 className={cn(textStyles.h2, "flex-1")}>Mis cursos</h2>
          <CreateCourseButton />
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
  const profile = await fetchMyProfile();
  if (!profile) {
    return <></>;
  }
  const coursesRepository = await locator.CoursesRepository();
  const results = await coursesRepository.getEnrolledCourses({
    profileId: profile?.id,
  });

  return (
    <Table >
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead className="w-[100px] text-right">Favorito</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((course) => (
          <TableRow key={course.courseId}>
            <TableCell className={cn(textStyles.small, "hover:underline truncate")}>
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
  );
}
