"use client";

import { z } from "@/i18n/zod";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { resetPasswordAction } from "../actions/reset-password-action";

const FormSchema = z
  .object({
    password: z.string().min(8).max(256),
    repeatPassword: z.string(),
  })
  .superRefine(({ password, repeatPassword }, ctx) => {
    if (password !== repeatPassword) {
      ctx.addIssue({
        path: ["repeatPassword"],
        code: "custom",
        params: {
          i18n: "passwordsDoNotMatch",
        },
      });
    }
  });

interface Props {
  email: string;
  token: string;
}

export function ResetPasswordForm({ email, token }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      repeatPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await resetPasswordAction({
        email,
        token,
        password: data.password,
      });

      const handler = new FormResponseHandler(response, form);
      if (!handler.hasErrors) setIsDialogOpen(true);
      handler.setErrors();
    } catch (error) {
      console.error(error);
      FormResponseHandler.setGlobalError(form);
    }
  }

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PasswordInputFormField
            label="Contraseña"
            name="password"
            placeholder="Tu nueva contraseña"
            autoComplete="new-password"
          />

          <PasswordInputFormField
            label="Repetir contraseña"
            name="repeatPassword"
            placeholder="Repite tu nueva contraseña"
            autoComplete="new-password"
          />

          <FormGlobalErrorMessage />
          <div className="flex justify-between space-x-6">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <FormSubmitButton>Enviar</FormSubmitButton>
          </div>
        </form>
      </FormProvider>
      {isDialogOpen && <ConfirmDialog email={email} />}
    </>
  );
}

interface ConfirmDialogProps {
  email: string;
}
export function ConfirmDialog({ email }: ConfirmDialogProps) {
  const router = useRouter();
  return (
    <Dialog open>
      <DialogContent
        onClose={() => router.push("/auth/login")}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Contraseña modificada</DialogTitle>
          <DialogDescription>
            La contraseña del usuario {email} ha sido modificada. Ya puedes
            iniciar sesión con tu nueva contraseña.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
