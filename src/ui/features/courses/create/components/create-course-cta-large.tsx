import { Button } from "@/src/ui/components/shadcn/ui/button";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { Sailboat } from "lucide-react";
import Link from "next/link";
import { CreateCourseButton } from "./create-course-button";

export function CreateCourseCtaLarge() {
  return (
    <div className="px-4">
      <div className="mx-auto max-w-prose">
        <div className="px-6 py-8 rounded-xl bg-slate-100 border-2 border-dashed border-slate-400">
          <Sailboat className="mx-auto size-8" />
          <div className="h-4" />
          <h2 className={cn(textStyles.h3, "text-center mx-auto max-w-sm")}>
            Empieza tu aventura
          </h2>
          <div className="h-4" />
          <p className={cn(textStyles.muted, "text-center mx-auto max-w-lg")}>
            Para aprender en clubmemo, primero debes{" "}
            <span className={cn(textStyles.small, "text-slate-700")}>
              crear o apuntarte a un curso
            </span>
            . ¡Es muy fácil! Haz clic abajo para empezar.
          </p>
          <div className="h-8" />
          <div className="mx-auto max-w-min flex space-x-4">
            <Button variant="link" asChild>
              <Link href="/discover">Explorar cursos</Link>
            </Button>
            <CreateCourseButton variant={undefined} />
          </div>
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}