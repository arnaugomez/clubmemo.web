import { invalidIdGuard } from "@/src/common/ui/guards/invalid-id-guard";
import type { PropsWithIdParam } from "@/src/common/ui/models/props-with-id-param";
import { handlePromiseError } from "@/src/common/utils/handle-promise-error";
import { CourseDetailMainSection } from "@/src/courses/ui/detail/components/course-detail-main-section";
import { fetchCourseDetail } from "@/src/courses/ui/detail/fetch/fetch-course-detail";
import { CourseNotesSection } from "@/src/notes/ui/course-notes/components/course-notes-section";
import { fetchMyProfile } from "@/src/profile/ui/fetch/fetch-my-profile";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

/**
 * Shows detailed data of a course.
 *
 * This component is also responsible for getting the data of the course
 * and checking that the profile has access rights to the course
 */
export default async function CourseDetailPage({
  params: { id },
}: PropsWithIdParam) {
  invalidIdGuard(id);

  const profile = await fetchMyProfile();
  const course = await fetchCourseDetail(id, profile?.id);

  if (!course || !course.canView) notFound();

  return (
    <div className="absolute inset-0 divide-slate-200 overflow-y-auto md:flex md:items-stretch md:divide-x-[1px] md:overflow-y-visible">
      <div className="w-full flex-none md:max-w-sm md:overflow-y-auto lg:max-w-md xl:max-w-lg">
        <CourseDetailMainSection course={course} profile={profile} />
      </div>
      <div className="min-w-0 flex-1 bg-slate-100 md:overflow-y-auto">
        <CourseNotesSection course={course} />
      </div>
    </div>
  );
}

/**
 * Generates the data inside the head tag of the HTML document, for the course detail page.
 */
export async function generateMetadata({
  params: { id },
}: PropsWithIdParam): Promise<Metadata> {
  const profile = await handlePromiseError(fetchMyProfile());
  const course = await handlePromiseError(fetchCourseDetail(id, profile?.id));
  if (!course || !course.canView) return {};
  return {
    title: course?.name,
    description: course?.description,
  };
}
