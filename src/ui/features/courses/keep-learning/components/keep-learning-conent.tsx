import { locator } from "@/src/core/common/locator";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { PartyPopper } from "lucide-react";
import { fetchMyProfile } from "../../../profile/fetch/fetch-my-profile";

export async function KeepLearningContent() {
  const profile = await fetchMyProfile();
  if (!profile) return null;
  const coursesRepository = await locator.CoursesRepository();
  const course = coursesRepository.getKeepLearning(profile.id);
  return <KeepLearningEmptyState />;
  // if (!course) return <KeepLearningEmptyState />;
  // return <>
  // </>;
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
