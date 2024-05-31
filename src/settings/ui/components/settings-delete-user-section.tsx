"use client";

import { z } from "@/i18n/zod";
import { clientLocator } from "@/src/common/di/client-locator";
import {
  InputFormField,
  PasswordInputFormField,
} from "@/src/common/ui/components/form/form-fields";
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
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { deleteUserAction } from "../actions/delete-user-action";

interface SettingsDeleteUserSectionProps {
  email: string;
}

export function SettingsDeleteUserSection({
  email,
}: SettingsDeleteUserSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <h2
        className={cn(
          textStyles.h3,
          "border-b-[1px] border-b-red-300 text-red-700",
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
      <Button onClick={() => setIsDialogOpen(true)} variant="destructive">
        Eliminar mi cuenta
      </Button>
      {isDialogOpen && (
        <DeleteUserDialog
          email={email}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </>
  );
}

interface DeleteUserDialogProps {
  email: string;
  onClose: () => void;
}

const FormSchema = z.object({
  password: z.string(),
  confirmation: z.string(),
});

type FormValues = z.infer<typeof FormSchema>;

function DeleteUserDialog({ email, onClose }: DeleteUserDialogProps) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmation: "",
    },
  });
  const onSubmit = form.handleSubmit(async function (data: FormValues) {
    try {
      const response = await deleteUserAction(data);
      const handler = new FormResponseHandler(response, form);
      if (!handler.hasErrors) router.push("/auth/signup");
      handler.setErrors();
    } catch (error) {
      clientLocator.ErrorTrackingService().captureError(error);
      FormResponseHandler.setGlobalError(form);
    }
  });

  const { isSubmitting } = form.formState;
  const confirmation = form.watch("confirmation");

  return (
    <Dialog open>
      <DialogContent onClose={isSubmitting ? undefined : onClose}>
        <DialogHeader>
          <DialogTitle>
            ¿Estás seguro que quieres eliminar tu cuenta?
          </DialogTitle>
          <DialogDescription>
            Esto eliminará todos los datos asociados a tu usuario {email},
            incluído tu perfil, cursos y tarjetas de aprendizaje. Una vez
            eliminados, no se podrán recuperar.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={onSubmit}>
            <div>
              <PasswordInputFormField
                label="Contraseña"
                name="password"
                placeholder="Tu contraseña"
                autoComplete="current-password"
              />
              <div className="h-4" />
              <InputFormField
                label="Escribe tu correo electrónico para confirmar"
                name="confirmation"
                onPaste={(e) => {
                  e.preventDefault();
                  return false;
                }}
                placeholder={email}
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
              <FormSubmitButton
                disabled={confirmation !== email}
                variant="destructive"
              >
                Eliminar mi usuario
              </FormSubmitButton>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
