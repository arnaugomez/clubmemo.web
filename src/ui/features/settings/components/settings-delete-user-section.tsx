"use client";

import { AsyncButton } from "@/src/ui/components/button/async-button";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";

export function SettingsDeleteUserSection() {
  return (
    <>
      <h2
        className={cn(
          textStyles.h3,
          "text-red-700 border-b-[1px] border-b-red-300",
        )}
      >
        Zona de peligro
      </h2>
      <div className="h-4" />
      <p className={"text-sm text-red-700"}>
        ¡Cuidado! Las acciones de esta sección son irreversibles. Una vez
        eliminado tu usuario, sus datos (perfil, cursos…) serán borrados de
        nuestra base de datos de forma definitiva.
      </p>
      <div className="h-6" />
      <AsyncButton onClick={() => {}} variant="destructive">
        Eliminar mi cuenta
      </AsyncButton>
    </>
  );
}
