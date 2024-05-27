import { locator } from "@/src/common/di/locator";
import { invalidIdGuard } from "@/src/common/ui/guards/invalid-id-guard";
import type { PropsWithIdParam } from "@/src/common/ui/models/props-with-id-param";
import { PracticePageLoader } from "@/src/practice/ui/components/practice-page-loader";
import { fetchMyProfile } from "@/src/profile/ui/fetch/fetch-my-profile";
import { notFound } from "next/navigation";

export default async function PracticePage({
  params: { id },
}: PropsWithIdParam) {
  invalidIdGuard(id);

  const profile = await fetchMyProfile();
  if (!profile) notFound();

  const coursesRepository = await locator.CoursesRepository();
  const course = await coursesRepository.getDetail({
    id,
    profileId: profile.id,
  });
  if (!course || !course.canView || !course.enrollment) notFound();
  return <PracticePageLoader course={course} enrollment={course.enrollment} />;
}
