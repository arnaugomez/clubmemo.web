import { locator } from "@/src/core/common/locator";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/src/ui/components/shadcn/ui/alert";
import { GenerateAiNotesWizard } from "@/src/ui/features/generate-ai-notes/components/generate-ai-notes-wizard";
import { fetchMyProfile } from "@/src/ui/features/profile/fetch/fetch-my-profile";
import { invalidIdGuard } from "@/src/ui/guards/invalid-id-guard";
import { textStyles } from "@/src/ui/styles/text-styles";
import { GraduationCap, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";

export default async function CourseAiGeneratorPage({
  params: { id },
}: {
  // TODO: create reusable type for id params
  params: { id: string };
}) {
  invalidIdGuard(id);

  const profile = await fetchMyProfile();

  const coursesRepository = await locator.CoursesRepository();
  const course = await coursesRepository.getDetail({
    id,
    profileId: profile?.id,
  });
  if (!course || !course.canEdit) notFound();

  return (
    <main>
      <div className="h-20" />
      <div className="px-4">
        <div className="mx-auto max-w-prose">
          <h1 className={textStyles.h2}>
            <Sparkles className="mr-3 inline size-8 -translate-y-1" />
            Generador AI
          </h1>
          <div className="h-4"></div>
          <p className={textStyles.base}>
            Genera tarjetas de aprendizaje de forma automática a partir de tus
            apuntes.
          </p>
          <div className="h-6"></div>
          <Alert>
            <GraduationCap size={16} />
            <AlertTitle>Curso</AlertTitle>
            <AlertDescription>{course.name}</AlertDescription>
          </Alert>
          <div className="h-10" />
          <GenerateAiNotesWizard courseId={course.id} />
        </div>
      </div>
    </main>
  );
}
