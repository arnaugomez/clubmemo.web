import { MyCoursesSection } from "@/src/ui/features/courses/my-courses/components/my-courses-section";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { GraduationCap } from "lucide-react";

export default function LearnPage() {
  return (
    <main>
      <div className="h-20" />
      <div className="px-4">
        <div className="mx-auto max-w-prose">
          <h1 className={cn(textStyles.h2, "")}>
            <GraduationCap className="inline size-8 -translate-y-1 mr-3" />
            Aprender
          </h1>
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
      <MyCoursesSection />
    </main>
  );
}
