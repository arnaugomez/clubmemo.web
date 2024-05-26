import { NullError } from "@/src/common/domain/models/app-errors";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import type { CourseModel } from "@/src/courses/domain/models/course-model";
import type { NoteModel } from "@/src/notes/domain/models/note-model";
import { useState } from "react";
import { PracticeActionsBar } from "../practice-actions-bar";

interface PracticeStepCardProps {
  note: NoteModel;
  course: CourseModel;
}

export function PracticeStepCard({ note, course }: PracticeStepCardProps) {
  const [showBack, setShowBack] = useState(false);
  if (!course.enrollment) throw new NullError("course.enrollment");
  return (
    <div className="flex size-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-8">
          <div
            className={cn(textStyles.base, "mx-auto max-w-sm font-medium")}
            dangerouslySetInnerHTML={{ __html: note.front }}
          ></div>
        </div>

        {showBack && (
          <div className="border-t-[1px] border-t-slate-200 px-4 py-8">
            <div
              className={cn(textStyles.base, "mx-auto max-w-sm")}
              dangerouslySetInnerHTML={{
                __html: note.back,
              }}
            ></div>
          </div>
        )}
      </div>
      <PracticeActionsBar
        showBack={showBack}
        setShowBack={setShowBack}
        enrollmentConfig={course.enrollment.config}
      />
    </div>
  );
}
