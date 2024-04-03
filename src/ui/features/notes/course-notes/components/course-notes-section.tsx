import { Button } from "@/src/ui/components/shadcn/ui/button";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CourseNotesEmptyState } from "./course-notes-empty-state";

interface CourseNotesSectionProps {
  courseId: string;
}

export function CourseNotesSection({ courseId }: CourseNotesSectionProps) {
  return (
    <>
      <div className="h-16"></div>
      <div className="px-4">
        <div className="mx-auto max-w-prose">
          <div className="flex items-center">
            <h2 className={cn(textStyles.h2, "text-slate-700 flex-1 truncate")}>
              Tarjetas de aprendizaje
            </h2>
            <Button size="sm">Nueva tarjeta</Button>
          </div>

          {/* TODO: Extract arrow link component. link addrress is missing. */}
          <Link href="/" className={cn(textStyles.mutedLink, "space-x-1 pt-1")}>
            <span>Ver todas</span>

            <ArrowRight size={16} className="inline" />
          </Link>
        </div>
        <div className="h-8"></div>
        <div className="px-4">
          <div className="mx-auto max-w-prose">
            <CourseNotesEmptyState courseId={courseId} />
          </div>
        </div>
        <div className="h-16"></div>
      </div>
    </>
  );
}
