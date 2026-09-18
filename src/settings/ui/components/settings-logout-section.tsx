"use client";
import { toast } from "sonner";
import { captureError } from "@/src/common/effect/client-runtime";
import { AsyncButton } from "@/src/common/ui/components/button/async-button";
import { logoutAction } from "../../../auth/ui/actions/logout-action";
import { SettingsSectionTitle } from "./settings-section-title";

export function SettingsLogoutSection() {
  async function handleLogout() {
    try {
      await logoutAction();
    } catch (error) {
      captureError(error);
      toast.error("Error al cerrar sesión");
    }
  }
  return (
    <>
      <SettingsSectionTitle>Cerrar sesión</SettingsSectionTitle>
      <AsyncButton onClick={handleLogout} variant="secondary">
        Cerrar sesión y salir
      </AsyncButton>
    </>
  );
}
