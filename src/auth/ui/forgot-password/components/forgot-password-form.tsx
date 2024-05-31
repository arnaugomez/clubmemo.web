"use client";

import { waitMilliseconds } from "@/src/common/domain/utils/promises";
import { InputFormField } from "@/src/common/ui/components/form/form-fields";
import { FormGlobalErrorMessage } from "@/src/common/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/common/ui/components/form/form-submit-button";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Suspense, lazy, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { forgotPasswordAction } from "../actions/forgot-password-action";
import type { ForgotPasswordActionModel } from "../schemas/forgot-password-action-schema";
import { ForgotPasswordActionSchema } from "../schemas/forgot-password-action-schema";
import { clientLocator } from "@/src/common/di/client-locator";

const ForgotPasswordConfirmDialog = lazy(async () => {
  const file = await import("./forgot-password-confirm-dialog");
  return { default: file.ForgotPasswordConfirmDialog };
});

export function ForgotPasswordForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(ForgotPasswordActionSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = form.handleSubmit(async function (
    data: ForgotPasswordActionModel,
  ) {
    try {
      const response = await forgotPasswordAction(data);
      const handler = new FormResponseHandler(response, form);
      if (!handler.hasErrors) {
        setIsDialogOpen(true);
        await waitMilliseconds(500);
      }
      handler.setErrors();
    } catch (error) {
      clientLocator.ErrorTrackingService().captureError(error);
      FormResponseHandler.setGlobalError(form);
    }
  });

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <InputFormField
            label="Correo electrónico"
            name="email"
            placeholder="Tu correo electrónico"
            autoComplete="email"
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
          <ForgotPasswordConfirmDialog email={form.getValues("email")} />
        </Suspense>
      )}
    </>
  );
}
