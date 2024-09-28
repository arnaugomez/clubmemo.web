import { textStyles } from "@/src/common/ui/styles/text-styles";
import { SlidersHorizontalIcon } from "lucide-react";

export function AdminGreeting() {
  return (
    <div className="px-4">
      <div className="mx-auto max-w-screen-lg">
        <h1 className={textStyles.h2}>
          <SlidersHorizontalIcon className="mr-3 inline size-8 -translate-y-1" />
          Panel de administración
        </h1>
        <div className="h-2" />
        <p className={textStyles.muted}>
          Bienvenido al panel de administración. Desde aquí puedes gestionar los
          cursos, usuarios y configuración de la plataforma.
        </p>
      </div>
    </div>
  );
}
