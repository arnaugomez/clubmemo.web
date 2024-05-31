"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { waitMilliseconds } from "@/src/common/domain/utils/promises";
import {
  InputFormField,
  PasswordInputFormField,
} from "@/src/common/ui/components/form/form-fields";
import { FormGlobalErrorMessage } from "@/src/common/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/common/ui/components/form/form-submit-button";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import Link from "next/link";
import { loginWithPasswordAction } from "../actions/login-with-password-action";
import type { LoginWithPasswordActionModel } from "../schemas/login-with-password-action-schema";
import { LoginWithPasswordActionSchema } from "../schemas/login-with-password-action-schema";
import { clientLocator } from "@/src/common/di/client-locator";

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(LoginWithPasswordActionSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async function onSubmit(
    data: LoginWithPasswordActionModel,
  ) {
    try {
      const response = await loginWithPasswordAction(data);
      const handler = new FormResponseHandler(response, form);
      if (!handler.hasErrors) await waitMilliseconds(1000);
      handler.setErrors();
    } catch (error) {
      clientLocator.ErrorTrackingService().captureError(error);
      FormResponseHandler.setGlobalError(form);
    }
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <InputFormField
          label="Correo electrónico"
          name="email"
          placeholder="Tu correo electrónico"
          autoComplete="email"
        />
        <div className="h-6" />
        <PasswordInputFormField
          label="Contraseña"
          name="password"
          placeholder="Tu contraseña"
          autoComplete="current-password"
        />
        <div className="h-2" />
        <p className={cn(textStyles.muted, "text-right hover:underline")}>
          <Link className="" href="/auth/forgot-password">
            Olvidaste tu contraseña?
          </Link>
        </p>
        <FormGlobalErrorMessage />
        <div className="h-6" />
        <div className="flex justify-between space-x-6">
          <Button variant="ghost" asChild>
            <Link href="/auth/signup">Nuevo usuario</Link>
          </Button>
          <FormSubmitButton>Login</FormSubmitButton>
        </div>
      </form>
    </FormProvider>
  );
}
