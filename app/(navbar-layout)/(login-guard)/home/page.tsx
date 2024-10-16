import { locator_courses_CoursesRepository } from "@/src/courses/locators/locator_courses-repository";
import { CreateCourseCtaLarge } from "@/src/courses/ui/create/components/create-course-cta-large";
import { InterestingCoursesSection } from "@/src/courses/ui/interesting-courses-section";
import { KeepLearningSection } from "@/src/courses/ui/keep-learning/components/keep-learning-section";
import { HomeGreeting } from "@/src/home/ui/components/home-greeting";
import { fetchMyProfile } from "@/src/profile/ui/fetch/fetch-my-profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inicio",
};

/**
 * Shows the home page.
 */
export default async function HomePage() {
  const profile = await fetchMyProfile();
  if (!profile) {
    return null;
  }
  const coursesRepository = locator_courses_CoursesRepository();
  const hasCourses = await coursesRepository.getHasCourses(profile.id);
  return (
    <main>
      <div className="h-24" />
      <HomeGreeting />

      <div className="h-6" />
      {hasCourses ? <HomePageSections /> : <CreateCourseCtaLarge />}
    </main>
  );
}

/**
 * Shows the different sections of the home page that should show up when the
 * user has already created or enrolled in a course
 */
function HomePageSections() {
  return (
    <>
      <KeepLearningSection />
      <div className="h-12" />
      <InterestingCoursesSection />
    </>
  );
}
