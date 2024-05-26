import { CreateCourseCtaLarge } from "@/src/courses/ui/create/components/create-course-cta-large";
import { InterestingCoursesSection } from "@/src/courses/ui/interesting-courses-section";
import { KeepLearningSection } from "@/src/courses/ui/keep-learning/components/keep-learning-section";
import { fetchHasCourses } from "@/src/courses/ui/my-courses/fetch/fetch-has-courses";
import { HomeGreeting } from "@/src/home/ui/components/home-greeting";
import { fetchMyProfile } from "@/src/profile/ui/fetch/fetch-my-profile";

export default async function HomePage() {
  const profile = await fetchMyProfile();
  if (!profile) {
    return null;
  }
  const hasCourses = await fetchHasCourses(profile.id);
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
