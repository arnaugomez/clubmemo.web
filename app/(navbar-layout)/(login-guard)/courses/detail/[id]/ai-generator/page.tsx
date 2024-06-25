import { GenerateAiNotesWizard } from "@/src/ai-generator/ui/components/generate-ai-notes-wizard";
import { locator } from "@/src/common/di/locator";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/src/common/ui/components/shadcn/ui/alert";
import { invalidIdGuard } from "@/src/common/ui/guards/invalid-id-guard";
import type { PropsWithIdParam } from "@/src/common/ui/models/props-with-id-param";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { fetchMyProfile } from "@/src/profile/ui/fetch/fetch-my-profile";
import { GraduationCap, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

export const maxDuration = 50;

export const metadata: Metadata = {
  title: "Generador AI",
};

/**
 * Shows the AI generator section for a given course
 */
export default async function CourseAiGeneratorPage({
  params: { id },
}: PropsWithIdParam) {
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
      <Script type="module" id="pdfjs">
        {
          "import pdfjsDist from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.2.67/+esm'"
        }
      </Script>
    </main>
  );
}
