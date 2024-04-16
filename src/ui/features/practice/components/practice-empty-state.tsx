import { Button } from "@/src/ui/components/shadcn/ui/button";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { PartyPopper } from "lucide-react";
import Link from "next/link";

interface PracticeEmptyStateProps {
  courseId: string;
}

export function PracticeEmptyState({ courseId }: PracticeEmptyStateProps) {
  return (
    <div className="size-full flex flex-col items-center justify-center px-4">
      <PartyPopper className="size-8 text-primary-500" />
      <div className="h-3"></div>
      <p className={cn(textStyles.base, "text-center max-w-md")}>
        No hay tarjetas pendientes de practicar para este curso. Ve a la sección
        &quot;Aprender&quot; para practicar otros cursos.
      </p>
      <div className="h-6"></div>
      <div className="flex space-x-3">
        <Button variant="secondary" className="w-full">
          <Link href={`/courses/detail/${courseId}`}>Volver al curso</Link>
        </Button>
        <Button className="w-full">
          <Link href="/learn">Aprender</Link>
        </Button>
      </div>
    </div>
  );
}
