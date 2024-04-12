"use client";
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
import { useState } from "react";
import {
  PracticeProvider,
  usePracticeContext,
} from "../contexts/practice-context";
import { TaskQueueProvider } from "../contexts/task-queue-context";
import { PracticeActionsBar } from "./practice-actions-bar";
import { PracticeProgress } from "./practice-progress";
import { PracticeWizardFinish } from "./practice-wizard-finish";
import { NullError } from "@/src/core/common/domain/models/app-errors";

interface PracticeWizardProps {
  courseData: CourseModelData;
  cardsData: PracticeCardModelData[];
}

export function PracticeWizard({ courseData, cardsData }: PracticeWizardProps) {
  const course = new CourseModel(courseData);
  const cards = cardsData.map((data) => new PracticeCardModel(data));

  return (
    <TaskQueueProvider>
      <PracticeProvider course={course} cards={cards}>
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
    <div className="size-full flex flex-col">
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
    <div className="size-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-8">
          <div className={cn(textStyles.base, "font-medium mx-auto max-w-sm")}>
            {note.front}
          </div>
        </div>

        {showBack && (
          <div className="px-4 py-8 border-t-[1px] border-t-slate-200">
            <div className={cn(textStyles.base, "mx-auto max-w-sm")}>
              {note.back}
            </div>
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
