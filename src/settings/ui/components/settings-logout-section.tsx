"use client";
import { locator_common_ErrorTrackingService } from "@/src/common/locators/locator_error-tracking-service";
import { AsyncButton } from "@/src/common/ui/components/button/async-button";
import { toast } from "sonner";
import { logoutAction } from "../../../auth/ui/actions/logout-action";
import { SettingsSectionTitle } from "./settings-section-title";

export function SettingsLogoutSection() {
  async function handleLogout() {
    try {
      await logoutAction();
    } catch (error) {
      locator_common_ErrorTrackingService().captureError(error);
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
