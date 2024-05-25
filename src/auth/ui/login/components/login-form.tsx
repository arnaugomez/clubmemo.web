"use client";

import { z } from "@/i18n/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { waitMilliseconds } from "@/src/common/domain/utils/promises";
import { EmailSchema } from "@/src/common/schemas/email-schema";
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

const FormSchema = z.object({
  email: EmailSchema,
  password: z.string(),
});

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await loginWithPasswordAction(data);
      const handler = new FormResponseHandler(response, form);
      if (!handler.hasErrors) await waitMilliseconds(1000);
      handler.setErrors();
    } catch (error) {
      console.error(error);
      FormResponseHandler.setGlobalError(form);
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
