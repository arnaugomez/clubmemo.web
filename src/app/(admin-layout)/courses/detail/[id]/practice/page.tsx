import { locator } from "@/src/core/common/locator";
import { PracticeContent } from "@/src/ui/features/practice/components/practice-content";
import { fetchMyProfile } from "@/src/ui/features/profile/fetch/fetch-my-profile";
import { invalidIdGuard } from "@/src/ui/guards/invalid-id-guard";
import { notFound } from "next/navigation";

export default async function PracticePage({
  params: { id },
}: {
  // TODO: create reusable type for id params
  params: { id: string };
}) {
  invalidIdGuard(id);

  const profile = await fetchMyProfile();
  if (!profile) notFound();

  const coursesRepository = await locator.CoursesRepository();
  const course = await coursesRepository.getDetail({
    id,
    profileId: profile?.id,
  });
  if (!course || !course.canView || !course.enrollment) notFound();
  return <PracticeContent course={course} enrollment={course.enrollment} />;
}
