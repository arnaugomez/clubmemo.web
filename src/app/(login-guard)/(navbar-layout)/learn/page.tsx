import { CreateCourseButton } from "@/src/ui/features/courses/create/components/create-course-button";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LearnPage() {
  return (
    <main>
      <div className="h-20" />
      <div className="px-4">
        <div className="mx-auto max-w-prose">
          <h1 className={cn(textStyles.h1, "mx-auto max-w-prose")}>Aprender</h1>
        </div>
      </div>

      <div className="h-10" />

      <section className="px-4">
        <div className="mx-auto max-w-prose">
          <h2 className={cn(textStyles.h3, "mx-auto max-w-prose")}>
            Sigue aprendiendo
          </h2>
        </div>
      </section>
      <div className="h-12" />
      <section className="px-4">
        <div className="mx-auto max-w-prose">
          <h2 className={cn(textStyles.h3, "mx-auto max-w-prose")}>
            Favoritos
          </h2>
        </div>
      </section>
      <div className="h-12" />
      <section className="px-4">
        <div className="mx-auto max-w-prose">
          <div className="flex items-end">
            <h2 className={cn(textStyles.h2, "flex-1")}>Mis cursos</h2>
            <CreateCourseButton />
          </div>
          <Link
            href="/courses"
            className={cn(textStyles.mutedLink, "space-x-1 pt-1")}
          >
            <span>Ver todos</span>

            <ArrowRight size={16} className="inline" />
          </Link>
        </div>
      </section>
    </main>
  );
}
