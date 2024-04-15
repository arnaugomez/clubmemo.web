import { CreateCourseCtaLarge } from "@/src/ui/features/courses/create/components/create-course-cta-large";
import { KeepLearningSection } from "@/src/ui/features/courses/keep-learning/components/keep-learning-section";
import { fetchHasCourses } from "@/src/ui/features/courses/my-courses/fetch/fetch-has-courses";
import { HomeGreeting } from "@/src/ui/features/home/components/home-greeting";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";

export default async function HomePage() {
  const hasCourses = await fetchHasCourses();
  return (
    <main>
      <div className="h-24" />
      <HomeGreeting />

      <div className="h-6" />
      {hasCourses ? <HomePageContent /> : <CreateCourseCtaLarge />}
    </main>
  );
}

function HomePageContent() {
  return (
    <>
      <KeepLearningSection />
      <div className="h-12" />
      <section className="px-4">
        <div className="mx-auto max-w-prose">
          <h2 className={cn(textStyles.h3, "mx-auto max-w-prose")}>
            Tu progreso
          </h2>
        </div>
      </section>
      <div className="h-12" />
      <section className="px-4">
        <div className="mx-auto max-w-prose">
          <h2 className={cn(textStyles.h3, "mx-auto max-w-prose")}>
            Te puede interesar
          </h2>
        </div>
      </section>
    </>
  );
}
