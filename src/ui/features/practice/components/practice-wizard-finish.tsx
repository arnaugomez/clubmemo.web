import PracticeLoadingPage from "@/src/app/(admin-layout)/courses/detail/[id]/practice/loading";
import { CourseModel } from "@/src/core/courses/domain/models/course-model";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { PartyPopper } from "lucide-react";
import Link from "next/link";
import { usePracticeContext } from "../contexts/practice-context";
import { useTaskQueueContext } from "../contexts/task-queue-context";

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
    <div className="size-full flex flex-col items-center justify-center px-4">
      <PartyPopper className="size-8 text-primary-500" />
      <div className="h-3"></div>
      <p className={cn(textStyles.base, "text-center max-w-md")}>
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
      <div className="w-full flex max-w-sm space-x-3">
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
