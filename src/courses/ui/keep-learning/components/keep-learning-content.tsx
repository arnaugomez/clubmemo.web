import { locator } from "@/src/common/di/locator";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { Card } from "@/src/common/ui/components/shadcn/ui/card";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import { PartyPopper, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";
import { getCourseDetailPath } from "../../utils/get-course-detail-path";

export async function KeepLearningContent() {
  const profile = await fetchMyProfile();
  if (!profile) return null;
  const coursesRepository = await locator.CoursesRepository();
  const course = await coursesRepository.getKeepLearning(profile.id);
  if (!course) return <KeepLearningEmptyState />;
  return (
    <Card className="flex h-64 flex-col overflow-clip sm:h-40 sm:flex-row">
      <div className="relative h-28 flex-none bg-slate-300 sm:h-full sm:w-56">
        {course.picture && (
          <Image src={course.picture} fill alt="" className="object-cover" />
        )}
      </div>
      <div className="min-w-0 flex-1 p-3">
        <h3 className={cn(textStyles.h4, "truncate hover:underline")}>
          <Link href={getCourseDetailPath(course.courseId)}>{course.name}</Link>
        </h3>
        <div className="h-1"></div>
        <p className={cn(textStyles.muted, "truncate")}>
          {course.description || "Curso sin descripción"}
        </p>
        <div className="h-1 sm:h-2"></div>
        <p className={cn(textStyles.small, "truncate")}>
          Aprender: {course.newCount} | Repasar: {course.dueCount}
        </p>
        <div className="h-3 sm:h-6"></div>
        <Button className="w-full" size="sm" asChild>
          <Link href={`/courses/detail/${course.courseId}/practice`}>
            <Play className="mr-2 size-4" />
            Practicar
          </Link>
        </Button>
      </div>
    </Card>
  );
}

function KeepLearningEmptyState() {
  return (
    <section className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-400 bg-slate-100 px-4 sm:h-40">
      <PartyPopper className="size-8 text-slate-700" />
      <div className="h-2"></div>
      <h2 className={cn(textStyles.h3, "text-center text-lg")}>
        ¡Enhorabuena! Práctica terminada.
      </h2>
      <div className="h-2"></div>
      <p className={cn(textStyles.muted, "max-w-sm text-center text-xs")}>
        Ya has terminado por hoy. Tómate un descanso o añade nuevos cursos y
        tarjetas para seguir aprendiendo.
      </p>
    </section>
  );
}
