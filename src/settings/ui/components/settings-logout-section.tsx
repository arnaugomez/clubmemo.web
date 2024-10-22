"use client";
import { AsyncButton } from "@/src/common/ui/components/button/async-button";
import { logoutAction } from "../../../auth/ui/actions/logout-action";
import { SettingsSectionTitle } from "./settings-section-title";

export function SettingsLogoutSection() {
  return (
    <>
      <SettingsSectionTitle>Cerrar sesión</SettingsSectionTitle>
      <AsyncButton onClick={() => logoutAction()} variant="secondary">
        Cerrar sesión y salir
      </AsyncButton>
    </>
  );
}
