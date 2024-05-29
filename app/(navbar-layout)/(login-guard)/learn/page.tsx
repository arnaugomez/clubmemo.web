import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import { CreateCourseCtaLarge } from "@/src/courses/ui/create/components/create-course-cta-large";
import { FavoriteCoursesSection } from "@/src/courses/ui/favorite-courses/components/favorite-courses-section";
import { KeepLearningSection } from "@/src/courses/ui/keep-learning/components/keep-learning-section";
import { MyCoursesPreviewSection } from "@/src/courses/ui/my-courses-preview/components/my-courses-preview-section";
import { fetchMyCoursesPreview } from "@/src/courses/ui/my-courses-preview/fetch/fetch-my-courses-preview";
import { GraduationCap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aprender",
};

export default async function LearnPage() {
  return (
    <main>
      <div className="h-20" />
      <div className="px-4">
        <div className="mx-auto max-w-prose">
          <h1 className={cn(textStyles.h2, "")}>
            <GraduationCap className="mr-3 inline size-8 -translate-y-1" />
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
