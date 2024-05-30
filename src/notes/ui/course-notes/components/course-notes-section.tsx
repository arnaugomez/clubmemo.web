import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import type { CourseModel } from "@/src/courses/domain/models/course-model";
import { Suspense } from "react";
import { CourseNotesProvider } from "../contexts/course-notes-context";
import { fetchCourseNotes } from "../fetch/fetch-course-notes";
import { CourseNotesDropdown } from "./course-notes-dropdown";
import { CourseNotesLoaded } from "./course-notes-loaded";
import { CourseNotesLoadingSkeletons } from "./course-notes-loading-skeletons";
import { CreateNoteButton } from "./create-note-button";

interface CourseNotesSectionProps {
  course: CourseModel;
}

export function CourseNotesSection({ course }: CourseNotesSectionProps) {
  return (
    <>
      <div className="h-16"></div>
      <div className="px-4">
        <CourseNotesProvider>
          <div className="mx-auto max-w-prose">
            <div className="flex items-center space-x-2">
              <h2
                className={cn(textStyles.h2, "flex-1 truncate text-slate-700")}
              >
                Tarjetas de aprendizaje
              </h2>
              <CreateNoteButton courseId={course.id} />
              <CourseNotesDropdown courseData={course.data} />
            </div>

            {/* <ArrowLink href="/cards">Ver todas</ArrowLink> */}
          </div>
          <div className="h-6"></div>
          <div className="mx-auto max-w-prose">
            <Suspense fallback={<CourseNotesLoadingSkeletons />}>
              <CourseNotesLoader courseId={course.id} />
            </Suspense>
          </div>
        </CourseNotesProvider>
      </div>
      <div className="h-16" />
    </>
  );
}

interface CourseNotesContentProps {
  courseId: string;
}

async function CourseNotesLoader({ courseId }: CourseNotesContentProps) {
  const pagination = await fetchCourseNotes({ courseId });

  return (
    <CourseNotesLoaded
      courseId={courseId}
      initialData={pagination.toData((e) => e.data)}
    />
  );
}
