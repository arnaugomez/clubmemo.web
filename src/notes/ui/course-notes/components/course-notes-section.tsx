import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import type { CourseModel } from "@/src/courses/domain/models/course-model";
import { notesLocator } from "@/src/notes/notes-locator";
import { Suspense } from "react";
import { CourseNotesProvider } from "../contexts/course-notes-context";
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
                Tarjetas{" "}
                <span className="hidden sm:inline">de aprendizaje</span>
              </h2>
              {course.canEdit && <CreateNoteButton courseId={course.id} />}
              <CourseNotesDropdown courseData={course.data} />
            </div>
          </div>
          <div className="h-6" />
          <div className="mx-auto max-w-prose">
            <Suspense fallback={<CourseNotesLoadingSkeletons />}>
              <CourseNotesLoader
                courseId={course.id}
                canEdit={course.canEdit}
              />
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
  canEdit: boolean;
}

async function CourseNotesLoader({
  courseId,
  canEdit,
}: CourseNotesContentProps) {
  const useCase = await notesLocator.GetNotesUseCase();
  const pagination = await useCase.execute({ courseId });

  return (
    <CourseNotesLoaded
      courseId={courseId}
      canEdit={canEdit}
      initialData={pagination.toData((e) => e.data)}
    />
  );
}
