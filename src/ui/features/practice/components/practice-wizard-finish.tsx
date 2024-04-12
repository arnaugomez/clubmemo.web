import PracticeLoadingPage from "@/src/app/(admin-layout)/courses/detail/[id]/practice/loading";
import { CourseModel } from "@/src/core/courses/domain/models/course-model";
import { PracticeCardModel } from "@/src/core/practice/domain/models/practice-card-model";
import { useTaskQueueContext } from "../contexts/task-queue-context";

interface PracticeWizardFinishProps {
  course: CourseModel;
  cards: PracticeCardModel[];
}

export function PracticeWizardFinish({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  course,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cards,
}: PracticeWizardFinishProps) {
  const { hasPendingTasks } = useTaskQueueContext();
  if (hasPendingTasks) {
    // TODO: show loading spinner
    return <PracticeLoadingPage />;
  }
  return (
    // TODO: show practice summary
    <>Práctica terminada!!</>
  );
}
