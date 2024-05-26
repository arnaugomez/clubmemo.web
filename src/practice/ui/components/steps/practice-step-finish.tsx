import PracticeLoadingPage from "@/app/(admin-layout)/courses/detail/[id]/practice/loading";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import type { CourseModel } from "@/src/courses/domain/models/course-model";
import { PartyPopper } from "lucide-react";
import Link from "next/link";
import { usePracticeContext } from "../../contexts/practice-context";
import { useTaskQueueContext } from "../../contexts/task-queue-context";

interface PracticeWizardFinishProps {
  course: CourseModel;
}

export function PracticeWizardFinish({ course }: PracticeWizardFinishProps) {
  const { hasPendingTasks } = useTaskQueueContext();
  const { canStartNextPractice, startNextPractice } = usePracticeContext();
  if (hasPendingTasks) {
    return <PracticeLoadingPage />;
  }
  return (
    <div className="flex size-full flex-col items-center justify-center px-4">
      <PartyPopper className="text-primary-500 size-8" />
      <div className="h-3"></div>
      <p className={cn(textStyles.base, "max-w-md text-center")}>
        Práctica completada
      </p>
      <div className="h-6"></div>
      {canStartNextPractice && (
        <div className="w-full max-w-sm pb-4">
          <Button onClick={startNextPractice} className="w-full">
            Seguir practicando
          </Button>
        </div>
      )}
      <div className="flex w-full max-w-sm space-x-3">
        <Button variant="link" className="flex-1">
          <Link href={`/courses/detail/${course.id}`}>Volver al curso</Link>
        </Button>
        <Button variant="secondary" className="flex-1">
          <Link href="/learn">Practicar otros cursos</Link>
        </Button>
      </div>
    </div>
  );
}
