"use client";
import { NullError } from "@/src/core/common/domain/models/app-errors";
import {
  CourseEnrollmentModel,
  CourseEnrollmentModelData,
} from "@/src/core/courses/domain/models/course-enrollment-model";
import {
  CourseModel,
  CourseModelData,
} from "@/src/core/courses/domain/models/course-model";
import { NoteModel } from "@/src/core/notes/domain/models/note-model";
import {
  PracticeCardModel,
  PracticeCardModelData,
} from "@/src/core/practice/domain/models/practice-card-model";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import DOMPurify from "isomorphic-dompurify";
import { useState } from "react";
import {
  PracticeProvider,
  usePracticeContext,
} from "../contexts/practice-context";
import { TaskQueueProvider } from "../contexts/task-queue-context";
import { PracticeActionsBar } from "./practice-actions-bar";
import { PracticeProgress } from "./practice-progress";
import { PracticeWizardFinish } from "./practice-wizard-finish";

interface PracticeWizardProps {
  courseData: CourseModelData;
  enrollmentData: CourseEnrollmentModelData;
  cardsData: PracticeCardModelData[];
}

export function PracticeWizard({
  courseData,
  enrollmentData,
  cardsData,
}: PracticeWizardProps) {
  const course = new CourseModel(courseData);
  const enrollment = new CourseEnrollmentModel(enrollmentData);
  const cards = cardsData.map((data) => new PracticeCardModel(data));
  console.log(cards);

  return (
    <TaskQueueProvider>
      <PracticeProvider enrollment={enrollment} course={course} cards={cards}>
        <PracticeWizardContent course={course} cards={cards} />
      </PracticeProvider>
    </TaskQueueProvider>
  );
}

interface PracticeWizardContentProps {
  course: CourseModel;
  cards: PracticeCardModel[];
}

function PracticeWizardContent(props: PracticeWizardContentProps) {
  const { currentCard } = usePracticeContext();
  return (
    <div className="flex size-full flex-col">
      <PracticeProgress />
      {currentCard ? (
        <PracticeCardSection note={currentCard.note} course={props.course} />
      ) : (
        <PracticeWizardFinish {...props} />
      )}
    </div>
  );
}

interface PracticeCardSectionProps {
  note: NoteModel;
  course: CourseModel;
}

function PracticeCardSection({ note, course }: PracticeCardSectionProps) {
  const [showBack, setShowBack] = useState(false);
  if (!course.enrollment) throw new NullError("course.enrollment");
  return (
    <div className="flex size-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-8">
          <div
            className={cn(textStyles.base, "mx-auto max-w-sm font-medium")}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.front) }}
          ></div>
        </div>

        {showBack && (
          <div className="border-t-[1px] border-t-slate-200 px-4 py-8">
            <div
              className={cn(textStyles.base, "mx-auto max-w-sm")}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(note.back),
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
