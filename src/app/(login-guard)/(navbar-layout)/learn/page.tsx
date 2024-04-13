import { CreateCourseCtaLarge } from "@/src/ui/features/courses/create/components/create-course-cta-large";
import { FavoriteCoursesSection } from "@/src/ui/features/courses/favorite-courses/components/favorite-courses-section";
import { KeepLearningSection } from "@/src/ui/features/courses/keep-learning/components/keep-learning-section";
import { MyCoursesPreviewSection } from "@/src/ui/features/courses/my-courses-preview/components/my-courses-preview-section";
import { fetchMyCoursesPreview } from "@/src/ui/features/courses/my-courses-preview/fetch/fetch-my-courses-preview";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { GraduationCap } from "lucide-react";

export default async function LearnPage() {
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
      <LearnPageContent />
    </main>
  );
}

async function LearnPageContent() {
  const courses = await fetchMyCoursesPreview();
  if (courses.length === 0) {
    return <CreateCourseCtaLarge />;
  }
  return (
    <>
      <KeepLearningSection />
      <div className="h-12" />
      <FavoriteCoursesSection />
      <div className="h-12" />
      <MyCoursesPreviewSection />
    </>
  );
}
