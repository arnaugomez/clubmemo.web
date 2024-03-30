import { locator } from "@/src/core/app/locator";
import { notFound } from "next/navigation";
import { fetchMyProfile } from "../../../profile/fetch/fetch-my-profile";

interface CourseDetailMainSectionProps {
  id: string;
}

export async function CourseDetailMainSection({
  id,
}: CourseDetailMainSectionProps) {
  const profile = await fetchMyProfile();
  const coursesRepository = await locator.CoursesRepository();
  const course = await coursesRepository.getDetail({
    id,
    profileId: profile?.id,
  });
  if (!course || !course.canView) notFound();

  return (
    <>
      <div className="h-4" />
      <div className="px-4">
        <div className="relative bg-slate-200 rounded-xl h-80"></div>
        <div className="">{id}</div>
      </div>
    </>
  );
}
