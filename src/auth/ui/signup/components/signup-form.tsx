"use client";

import { z } from "@/i18n/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { waitMilliseconds } from "@/src/common/domain/utils/promises";
import { EmailSchema } from "@/src/common/schemas/email-schema";
import { PasswordSchema } from "@/src/common/schemas/password-schema";
import {
  InputFormField,
  PasswordInputFormField,
} from "@/src/common/ui/components/form/form-fields";
import { FormGlobalErrorMessage } from "@/src/common/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/common/ui/components/form/form-submit-button";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { useCommandEnter } from "@/src/common/ui/hooks/use-command-enter";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import { Check } from "lucide-react";
import Link from "next/link";
import { signupAction } from "../actions/signup-action";
import { clientLocator } from "@/src/common/di/client-locator";

const SignupFormSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export function SignupForm() {
  const form = useForm({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async function (
    data: z.infer<typeof SignupFormSchema>,
  ) {
    try {
      const response = await signupAction(data);
      const handler = new FormResponseHandler(response, form);
      if (!handler.hasErrors) await waitMilliseconds(1000);
      handler.setErrors();
    } catch (error) {
      clientLocator.ErrorTrackingService().captureError(error);
      FormResponseHandler.setGlobalError(form);
    }
  });
  useCommandEnter(onSubmit);

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <InputFormField
          label="Correo electrónico"
          name="email"
          placeholder="Tu correo electrónico"
          autoComplete="email"
        />
        <PasswordInputFormField
          label="Contraseña"
          name="password"
          placeholder="Tu contraseña"
          autoComplete="new-password"
        />
        <FormGlobalErrorMessage />
        <div className="flex justify-between space-x-6">
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
          <FormSubmitButton>Crear cuenta</FormSubmitButton>
        </div>
        <p className="text-sm italic">
          <Check size={16} className="inline" /> Con el envío de este
          formulario, acepto la{" "}
          <a
            className="underline"
            href="/compliance/license.txt"
            target="_blank"
          >
            licencia de uso
          </a>
          , la{" "}
          <a
            className="underline"
            href="/compliance/cookies.md"
            target="_blank"
          >
            política de cookies
          </a>{" "}
          y la{" "}
          <a
            className="underline"
            href="/compliance/privacy.md"
            target="_blank"
          >
            política de privacidad.
          </a>
        </p>
      </form>
    </FormProvider>
  );
}
