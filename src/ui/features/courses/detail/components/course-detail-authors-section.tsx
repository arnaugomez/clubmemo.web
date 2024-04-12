import { locator } from "@/src/core/common/locator";
import { CourseModel } from "@/src/core/courses/domain/models/course-model";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/ui/components/shadcn/ui/avatar";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { User } from "lucide-react";
import Link from "next/link";

interface CourseDetailAuthorSectionProps {
  course: CourseModel;
}

export async function CourseDetailAuthorsSection({
  course,
}: CourseDetailAuthorSectionProps) {
  const authorsRepository = await locator.CourseAuthorsRepository();
  const authors = await authorsRepository.get(course.id);
  return (
    <section className="px-4 pt-6 border-t-[1px] border-t-slate-200">
      <h2 className={cn(textStyles.muted, "uppercase font-medium")}>Autores</h2>
      <div className="h-4" />
      {authors.map((author) => (
        <div className="pb-3" key={author.profileId + author.permissionType}>
          <div className="w-full flex space-x-3 items-center py-1">
            <Avatar className="flex-none">
              <AvatarImage src={author.picture} alt="Imagen de perfil" />
              <AvatarFallback className="text-slate-500 hover:bg-slate-200">
                <User />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="h-1" />
              <h3 className={cn(textStyles.small, "truncate")}>
                <Link
                  href={
                    author.handle
                      ? `/profile/${author.handle}`
                      : `/profile/id/${author.profileId}`
                  }
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
