"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { waitMilliseconds } from "@/src/core/app/utils/promises";
import {
  InputFormField,
  PasswordInputFormField,
} from "@/src/ui/components/form/form-fields";
import { FormGlobalErrorMessage } from "@/src/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/ui/components/form/form-submit-button";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { Form } from "@/src/ui/components/shadcn/ui/form";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { FormResponseHandler } from "@/src/ui/view-models/server-form-errors";
import Link from "next/link";
import { loginAction } from "../actions/login-action";

const FormSchema = z.object({
  email: z.string().email().max(254),
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
      const response = await loginAction(data);
      const handler = new FormResponseHandler(response, form);
      if (!handler.hasErrors) await waitMilliseconds(1000);
      handler.setErrors();
    } catch (error) {
      console.error(error);
      FormResponseHandler.setGlobalError(form);
    }
  }

  return (
    <Form {...form}>
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
        <div className="flex space-x-6 justify-between">
          <Button variant="ghost" asChild>
            <Link href="/auth/signup">Nuevo usuario</Link>
          </Button>
          <FormSubmitButton>Login</FormSubmitButton>
        </div>
      </form>
    </Form>
  );
}
