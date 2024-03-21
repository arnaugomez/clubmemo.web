"use client";
import { AsyncButton } from "@/src/ui/components/button/async-button";
import { logoutAction } from "../../auth/actions/logout-action";
import { SettingsSectionTitle } from "./settings-section-title";

export function SettingsLogoutSection() {
  return (
    <>
      <SettingsSectionTitle>Cerrar sesión</SettingsSectionTitle>
      <AsyncButton onClick={() => logoutAction()} variant="secondary">
        Logout
      </AsyncButton>
    </>
  );
}
