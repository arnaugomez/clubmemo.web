import { locator } from "@/src/core/app/locator";
import { CourseModel } from "@/src/core/courses/domain/models/course-model";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/ui/components/shadcn/ui/avatar";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { User } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchMyProfile } from "../../../profile/fetch/fetch-my-profile";
import { CourseDetailActionsSection } from "./course-detail-actions-section";

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
        <div className="relative bg-slate-200 rounded-xl h-40 sm:h-52 lg:h-64 overflow-hidden">
          {course.picture && <Image fill src={course.picture} alt="" />}
          <CourseDetailActionsSection course={course} />
        </div>
        <div className="h-4" />
        <p className={textStyles.muted}>
          {course.isPublic ? "Curso público" : "Curso privado"}
        </p>
        <div className="h-2" />
        <h1 className={textStyles.h2}>{course.name}</h1>
        <div className="h-4" />
        <p className={cn(textStyles.p, "whitespace-pre-line")}>
          {course.description || "Este curso no tiene descripción"}
        </p>
        <div className="h-12" />
        <Button className="w-full">Practicar</Button>
        <div className="h-6" />
      </div>
      <CourseDetailAuthorSection course={course} />
    </>
  );
}

interface CourseDetailAuthorSectionProps {
  course: CourseModel;
}

async function CourseDetailAuthorSection({}: CourseDetailAuthorSectionProps) {
  // TODO use real authors data, do not mock data
  return (
    <section className="px-4 pt-6 border-t-[1px] border-t-slate-200">
      <h2 className={cn(textStyles.muted, "uppercase font-medium")}>Autores</h2>
      <div className="h-4"></div>
      <div className="w-full flex space-x-3 items-center py-1">
        <Avatar className="flex-none">
          <AvatarImage src={undefined} alt="Imagen de perfil" />
          <AvatarFallback className="text-slate-500 hover:bg-slate-200">
            <User />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="h-2" />
          <h3 className={cn(textStyles.small, "truncate")}>
            John Doe del pilar hermoso de la serra
          </h3>
          <p className={cn(textStyles.muted)}>Autor</p>
        </div>
      </div>
      <div className="h-3" />
      <div className="w-full flex space-x-3 items-center">
        <Avatar className="flex-none">
          <AvatarImage src={undefined} alt="Imagen de perfil" />
          <AvatarFallback className="text-slate-500 hover:bg-slate-200">
            <User />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="h-2" />
          <h3 className={cn(textStyles.small, "truncate")}>
            John Doe del pilar hermoso de la serra
          </h3>
          <p className={cn(textStyles.muted)}>Autor</p>
        </div>
      </div>
      <div className="h-4"></div>
    </section>
  );
}
