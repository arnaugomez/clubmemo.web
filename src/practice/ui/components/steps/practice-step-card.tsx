import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import type { CourseEnrollmentModel } from "@/src/courses/domain/models/course-enrollment-model";
import type { NoteModel } from "@/src/notes/domain/models/note-model";
import { useState } from "react";
import { usePracticeContext } from "../../contexts/practice-context";
import { PracticeActionsBar } from "../practice-actions-bar";

interface PracticeStepCardProps {
  note: NoteModel;
  enrollment: CourseEnrollmentModel;
}

export function PracticeStepCard({ note, enrollment }: PracticeStepCardProps) {
  const [showBack, setShowBack] = useState(false);
  const practiceContext = usePracticeContext();
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
        onShowBack={() => setShowBack(true)}
        showBack={showBack}
        onRate={(rating) => {
          setShowBack(false);
          practiceContext.rate(rating);
        }}
        daysToNextReview={practiceContext.daysToNextReview}
        enrollmentConfig={enrollment.config}
      />
    </div>
  );
}
