"use client";

import { AsyncButton } from "@/src/common/ui/components/button/async-button";
import { PasswordInputFormField } from "@/src/common/ui/components/form/form-fields";
import { FormGlobalErrorMessage } from "@/src/common/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/common/ui/components/form/form-submit-button";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/common/ui/components/shadcn/ui/dialog";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { changePasswordAction } from "../actions/change-password-action";
import { ChangePasswordSchema } from "../schemas/change-password-schema";
import { SettingsSectionTitle } from "./settings-section-title";

export function SettingsChangePasswordSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <SettingsSectionTitle>Mis credenciales</SettingsSectionTitle>
      <AsyncButton onClick={() => setIsDialogOpen(true)} variant="secondary">
        Cambiar contraseña
      </AsyncButton>
      {isDialogOpen && (
        <ChangePasswordDialog onClose={() => setIsDialogOpen(false)} />
      )}
    </>
  );
}

interface ChangePasswordDialogProps {
  onClose: () => void;
}

type FormValues = z.infer<typeof ChangePasswordSchema>;

function ChangePasswordDialog({ onClose }: ChangePasswordDialogProps) {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      repeatNewPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const response = await changePasswordAction(data);
      const handler = new FormResponseHandler(response, form);
      if (!handler.hasErrors) {
        router.push("/home");
        toast.success("Contraseña cambiada con éxito");
      }
      handler.setErrors();
    } catch (error) {
      console.error(error);
      FormResponseHandler.setGlobalError(form);
    }
  });

  const { isSubmitting } = form.formState;

  return (
    <Dialog open>
      <DialogContent onClose={isSubmitting ? undefined : onClose}>
        <DialogHeader>
          <DialogTitle>Cambiar contraseña</DialogTitle>
          <DialogDescription>
            Elige una contraseña segura para proteger tu cuenta. El cambio de
            contraseña cerrará la sesión en todos los dispositivos.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={onSubmit}>
            <div>
              <PasswordInputFormField
                label="Tu contraseña actual"
                name="password"
                placeholder="Tu contraseña"
                autoComplete="current-password"
              />
              <div className="h-4" />
              <PasswordInputFormField
                label="Nueva contraseña"
                name="newPassword"
                placeholder="Tu nueva contraseña"
                autoComplete="new-password"
              />
              <div className="h-4" />
              <PasswordInputFormField
                label="Repetir contraseña"
                name="repeatNewPassword"
                placeholder="Tu nueva contraseña"
                autoComplete="new-password"
              />
              <FormGlobalErrorMessage />
            </div>
            <div className="h-6" />
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={onClose}
              >
                Volver
              </Button>
              <FormSubmitButton>Enviar</FormSubmitButton>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
