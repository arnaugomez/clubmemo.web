import { CreateCourseCtaLarge } from "@/src/ui/features/courses/create/components/create-course-cta-large";
import { InterestingCoursesSection } from "@/src/ui/features/courses/interesting-courses-section";
import { KeepLearningSection } from "@/src/ui/features/courses/keep-learning/components/keep-learning-section";
import { fetchHasCourses } from "@/src/ui/features/courses/my-courses/fetch/fetch-has-courses";
import { HomeGreeting } from "@/src/ui/features/home/components/home-greeting";

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
      <InterestingCoursesSection />
    </>
  );
}
