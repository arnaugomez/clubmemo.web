"use client";

import { waitMilliseconds } from "@/src/common/domain/utils/promise";
import { FormGlobalErrorMessage } from "@/src/common/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/common/ui/components/form/form-submit-button";
import { InputFormField } from "@/src/common/ui/components/form/input-form-field";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { forgotPasswordAction } from "../actions/forgot-password-action";
import type { ForgotPasswordActionModel } from "../schemas/forgot-password-action-schema";
import { ForgotPasswordActionSchema } from "../schemas/forgot-password-action-schema";
import { locator_common_ErrorTrackingService } from "@/src/common/locators/locator_error-tracking-service";

const ForgotPasswordConfirmDialog = dynamic(() =>
  import("./forgot-password-confirm-dialog").then(
    (file) => file.ForgotPasswordConfirmDialog,
  ),
);

/**
 * Form that the user fills in to request a password reset email.
 */
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
      locator_common_ErrorTrackingService().captureError(error);
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
        <ForgotPasswordConfirmDialog email={form.getValues("email")} />
      )}
    </>
  );
}
