import { locator } from "@/src/core/common/locator";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { Card } from "@/src/ui/components/shadcn/ui/card";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { PartyPopper, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { fetchMyProfile } from "../../../profile/fetch/fetch-my-profile";

export async function KeepLearningContent() {
  const profile = await fetchMyProfile();
  if (!profile) return null;
  const coursesRepository = await locator.CoursesRepository();
  const course = await coursesRepository.getKeepLearning(profile.id);
  if (!course) return <KeepLearningEmptyState />;
  return (
    <Card className="h-64 sm:h-40 flex flex-col sm:flex-row overflow-clip">
      <div className="flex-none sm:w-56 relative h-28 sm:h-full bg-slate-300">
        {course.picture && (
          <Image src={course.picture} layout="fill" alt="" objectFit="cover" />
        )}
      </div>
      <div className="p-3 min-w-0">
        <h3 className={cn(textStyles.h4, "hover:underline truncate")}>
          <Link href={`/courses/detail/${course.courseId}`}>{course.name}</Link>
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
            <Play className="size-4 mr-2" />
            Practicar
          </Link>
        </Button>
      </div>
    </Card>
  );
}

function KeepLearningEmptyState() {
  return (
    <section className="h-64 sm:h-40 flex flex-col justify-center items-center rounded-xl bg-slate-100 border-2 border-dashed border-slate-400 px-4">
      <PartyPopper className="size-8 text-slate-700" />
      <div className="h-2"></div>
      <h2 className={cn(textStyles.h3, "text-lg text-center")}>
        ¡Enhorabuena! Práctica terminada.
      </h2>
      <div className="h-2"></div>
      <p className={cn(textStyles.muted, "text-xs text-center max-w-sm")}>
        Ya has terminado por hoy. Tómate un descanso o añade nuevos cursos y
        tarjetas para seguir aprendiendo.
      </p>
    </section>
  );
}
