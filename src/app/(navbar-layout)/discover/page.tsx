import { locator } from "@/src/core/app/locator";

export default async function DiscoverPage() {
  const coursesRepository = await locator.CoursesRepository();
  coursesRepository.getDiscoverCourses({});
  return <h1>Discover</h1>;
}
