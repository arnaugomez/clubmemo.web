import { invalidIdGuard } from "@/src/common/ui/guards/invalid-id-guard";
import type { PropsWithIdParam } from "@/src/common/ui/models/props-with-id-param";
import { fetchCourseDetail } from "@/src/courses/ui/detail/fetch/fetch-course-detail";
import { PracticePageLoader } from "@/src/practice/ui/components/practice-page-loader";
import { fetchMyProfile } from "@/src/profile/ui/fetch/fetch-my-profile";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Practicar curso",
};

export default async function PracticePage({
  params: { id },
}: PropsWithIdParam) {
  invalidIdGuard(id);

  const profile = await fetchMyProfile();
  if (!profile) notFound();
  const course = await fetchCourseDetail(id, profile.id);

  if (!course || !course.canView || !course.enrollment) notFound();
  return <PracticePageLoader course={course} enrollment={course.enrollment} />;
}
