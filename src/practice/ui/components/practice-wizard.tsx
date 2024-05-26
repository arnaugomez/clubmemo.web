"use client";
import type { CourseEnrollmentModelData } from "@/src/courses/domain/models/course-enrollment-model";
import { CourseEnrollmentModel } from "@/src/courses/domain/models/course-enrollment-model";
import type { CourseModelData } from "@/src/courses/domain/models/course-model";
import { CourseModel } from "@/src/courses/domain/models/course-model";
import type { PracticeCardModelData } from "@/src/practice/domain/models/practice-card-model";
import { PracticeCardModel } from "@/src/practice/domain/models/practice-card-model";
import {
  PracticeProvider,
  usePracticeContext,
} from "../contexts/practice-context";
import { TaskQueueProvider } from "../contexts/task-queue-context";
import { PracticeProgress } from "./practice-progress";
import { PracticeStepCard } from "./steps/practice-step-card";
import { PracticeWizardFinish } from "./steps/practice-step-finish";

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
  const { currentCard, progress } = usePracticeContext();
  return (
    <div className="flex size-full flex-col">
      <PracticeProgress progress={progress} />
      {currentCard ? (
        <PracticeStepCard note={currentCard.note} course={props.course} />
      ) : (
        <PracticeWizardFinish {...props} />
      )}
    </div>
  );
}
