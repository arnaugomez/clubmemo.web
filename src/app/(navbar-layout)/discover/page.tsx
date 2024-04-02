import { locator } from "@/src/core/app/locator";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { Compass } from "lucide-react";

export default async function DiscoverPage() {
  const coursesRepository = await locator.CoursesRepository();
  coursesRepository.getDiscoverCourses({});
  return (
    <main>
      <div className="h-20" />
      <div className="px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className={cn(textStyles.h2)}>
            {/* TODO: add cool animation to compass icon when page starts */}
            <Compass className="inline size-8 -translate-y-1 mr-3" />
            Explorar cursos
          </h1>
          <div className="h-10 bg-red-50" />
        </div>
      </div>
      <div className="h-10" />
      {/* <LearnPageContent /> */}
    </main>
  );
}
