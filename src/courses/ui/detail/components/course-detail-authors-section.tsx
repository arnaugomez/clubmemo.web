import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/common/ui/components/shadcn/ui/avatar";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import type { CourseAuthorModel } from "@/src/courses/domain/models/course-author-model";
import type { CourseModel } from "@/src/courses/domain/models/course-model";
import { locator_courses_CourseAuthorsRepository } from "@/src/courses/locators/locator_course-authors-repository";
import { getProfilePagePath } from "@/src/profile/ui/utils/get-profile-page-path";
import { User } from "lucide-react";
import Link from "next/link";

interface CourseDetailAuthorSectionProps {
  course: CourseModel;
}

export async function CourseDetailAuthorsSectionLoader({
  course,
}: CourseDetailAuthorSectionProps) {
  const authorsRepository = locator_courses_CourseAuthorsRepository();
  const authors = await authorsRepository.get(course.id);
  return <CourseDetailAuthorsSectionLoaded authors={authors} />;
}

interface CourseDetailAuthorsSectionLoadedProps {
  authors: CourseAuthorModel[];
}

export function CourseDetailAuthorsSectionLoaded({
  authors,
}: CourseDetailAuthorsSectionLoadedProps) {
  return (
    <section className="border-t-[1px] border-t-slate-200 px-4 pt-6">
      <h2 className={cn(textStyles.muted, "font-medium uppercase")}>Autores</h2>
      <div className="h-4" />
      {authors.map((author) => (
        <div className="pb-3" key={author.profileId + author.permissionType}>
          <div className="flex w-full items-center space-x-3 py-1">
            <Avatar className="flex-none">
              <AvatarImage
                sizes="40px"
                src={author.picture}
                alt="Imagen de perfil"
              />
              <AvatarFallback className="text-slate-500 hover:bg-slate-200">
                <User />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="h-1" />
              <h3 className={cn(textStyles.small, "truncate")}>
                <Link
                  href={getProfilePagePath({
                    id: author.profileId,
                    handle: author.handle,
                  })}
                  className={cn("hover:underline")}
                >
                  {author.displayName || "Nuevo usuario"}
                </Link>
              </h3>
              <p className={cn(textStyles.muted)}>
                {author.handle ? `@${author.handle}` : "Autor"}
              </p>
            </div>
          </div>
        </div>
      ))}
      <div className="h-1"></div>
    </section>
  );
}
