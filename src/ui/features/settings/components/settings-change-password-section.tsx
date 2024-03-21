"use client";

import { AsyncButton } from "@/src/ui/components/button/async-button";
import { SettingsSectionTitle } from "./settings-section-title";

export function SettingsChangePasswordSection() {
  return (
    <>
      <SettingsSectionTitle>Mis credenciales</SettingsSectionTitle>
      <AsyncButton onClick={() => {}} variant="secondary">
        Cambiar contraseña
      </AsyncButton>
    </>
  );
}
