import * as Effect from "effect/Effect";
import { GraduationCap, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { GenerateAiNotesWizard } from "@/src/ai-generator/ui/components/generate-ai-notes-wizard";
import { runServer } from "@/src/common/effect/server-runtime";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/src/common/ui/components/shadcn/ui/alert";
import { invalidIdGuard } from "@/src/common/ui/guards/invalid-id-guard";
import type { PropsWithIdParam } from "@/src/common/ui/models/props-with-id-param";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { CoursesRepository } from "@/src/courses/layers/layer_courses-repository";
import { fetchMyProfile } from "@/src/profile/ui/fetch/fetch-my-profile";

export const maxDuration = 50;

export const metadata: Metadata = {
  title: "Generador AI",
};

/**
 * Shows the AI generator section for a given course
 */
export default async function CourseAiGeneratorPage(props: PropsWithIdParam) {
  return runServer(
    Effect.gen(function* () {
      const { id } = yield* Effect.tryPromise({
        try: () => props.params,
        catch: (error) => error,
      });
      invalidIdGuard(id);

      const profile = yield* Effect.tryPromise({
        try: () => fetchMyProfile(),
        catch: (error) => error,
      });

      const coursesRepository = yield* CoursesRepository;
      const course = yield* coursesRepository.getDetail({
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
                Genera tarjetas de aprendizaje de forma automática a partir de
                tus apuntes.
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
              "import * as pdfjsDist from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.2.67/+esm'; window.pdfjsLib = pdfjsDist;"
            }
          </Script>
        </main>
      );
    }),
  );
}
