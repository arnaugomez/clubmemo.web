"use client";

import { z } from "@/i18n/zod";
import { PasswordInputFormField } from "@/src/common/ui/components/form/form-fields";
import { FormGlobalErrorMessage } from "@/src/common/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/common/ui/components/form/form-submit-button";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";

import { waitMilliseconds } from "@/src/common/domain/utils/promises";
import { PasswordSchema } from "@/src/common/schemas/password-schema";
import { useCommandEnter } from "@/src/common/ui/hooks/use-command-enter";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Suspense, lazy, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { resetPasswordAction } from "../actions/reset-password-action";
import { clientLocator } from "@/src/common/di/client-locator";

const ResetPasswordConfirmDialog = lazy(async () => {
  const file = await import("./reset-password-confirm-dialog");
  return { default: file.ResetPasswordConfirmDialog };
});

const FormSchema = z
  .object({
    password: PasswordSchema,
    repeatPassword: PasswordSchema,
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

  const onSubmit = form.handleSubmit(async function (
    data: z.infer<typeof FormSchema>,
  ) {
    try {
      const response = await resetPasswordAction({
        email,
        token,
        password: data.password,
      });

      const handler = new FormResponseHandler(response, form);
      if (!handler.hasErrors) {
        setIsDialogOpen(true);
        await waitMilliseconds(1000);
      }
      handler.setErrors();
    } catch (error) {
      clientLocator.ErrorTrackingService().captureError(error);
      FormResponseHandler.setGlobalError(form);
    }
  });
  useCommandEnter(onSubmit);

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
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
      {isDialogOpen && (
        <Suspense>
          <ResetPasswordConfirmDialog email={email} />
        </Suspense>
      )}
    </>
  );
}
