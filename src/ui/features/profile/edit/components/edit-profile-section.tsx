"use client";

import {
  ProfileModel,
  ProfileModelData,
} from "@/src/core/profile/domain/models/profile-model";
import { PasswordInputFormField } from "@/src/ui/components/form/form-fields";
import { FormGlobalErrorMessage } from "@/src/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/ui/components/form/form-submit-button";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/components/shadcn/ui/dialog";
import { Form } from "@/src/ui/components/shadcn/ui/form";
import { FormResponseHandler } from "@/src/ui/view-models/server-form-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { changePasswordAction } from "../../../settings/actions/change-password-action";
import { ChangePasswordSchema } from "../../../settings/schemas/change-password-schema";

interface EditProfileSectionProps {
  profileData: ProfileModelData;
}

export function EditProfileSection({ profileData }: EditProfileSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const profile = new ProfileModel(profileData);
  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="secondary">
        <Edit2 className="size-4 mr-3" /> Editar
      </Button>
      {isOpen && (
        <EditProfileDialog onClose={() => setIsOpen(false)} profile={profile} />
      )}
    </>
  );
}

interface EditProfileDialogProps {
  profile: ProfileModel;
  onClose: () => void;
}

type FormValues = z.infer<typeof ChangePasswordSchema>;

function EditProfileDialog({ profile, onClose }: EditProfileDialogProps) {
  console.log(profile);

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
        // TODO: refresh data
        onClose();
      }
      handler.setErrors();
    } catch (error) {
      console.error(error);
      FormResponseHandler.setGlobalError(form);
    }
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open>
      <DialogContent
        onClose={isSubmitting ? undefined : onClose}
        className="sm:max-w-xl"
      >
        <DialogHeader>
          <DialogTitle>Cambiar contraseña</DialogTitle>
          <DialogDescription>
            Elige una contraseña segura para proteger tu cuenta. El cambio de
            contraseña cerrará la sesión en todos los dispositivos.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}
