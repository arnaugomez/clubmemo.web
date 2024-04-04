import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { CourseNotesProvider } from "../contexts/course-notes-context";
import { fetchCourseNotes } from "../fetch/fetch-course-notes";
import { CourseNotesEmptyState } from "./course-notes-empty-state";
import { CourseNotesLoadingSkeletons } from "./course-notes-loading-skeletons";
import { CreateNoteButton } from "./create-note-button";
import { CourseNotesResultsSection } from "./course-notes-results-section";

interface CourseNotesSectionProps {
  courseId: string;
}

export function CourseNotesSection({ courseId }: CourseNotesSectionProps) {
  return (
    <>
      <div className="h-16"></div>
      <div className="px-4">
        <CourseNotesProvider>
          <div className="mx-auto max-w-prose">
            <div className="flex items-center">
              <h2
                className={cn(textStyles.h2, "text-slate-700 flex-1 truncate")}
              >
                Tarjetas de aprendizaje
              </h2>
              <CreateNoteButton courseId={courseId} />
            </div>

            {/* TODO: Extract arrow link component. link addrress is missing. */}
            <Link
              href="/"
              className={cn(textStyles.mutedLink, "space-x-1 pt-1")}
            >
              <span>Ver todas</span>

              <ArrowRight size={16} className="inline" />
            </Link>
          </div>
          <div className="h-6"></div>
          <div className="mx-auto max-w-prose">
            <Suspense fallback={<CourseNotesLoadingSkeletons />}>
              <CourseNotesContent courseId={courseId} />
            </Suspense>
          </div>
        </CourseNotesProvider>
      </div>
      <div className="h-16"></div>
    </>
  );
}

interface CourseNotesContentProps {
  courseId: string;
}

async function CourseNotesContent({ courseId }: CourseNotesContentProps) {
  const pagination = await fetchCourseNotes({ courseId });

  if (pagination.results.length === 0) {
    return <CourseNotesEmptyState courseId={courseId} />;
  }
  return (
    <CourseNotesResultsSection
      courseId={courseId}
      initialData={pagination.toData((e) => e.data)}
    />
  );
}
