"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { waitMilliseconds } from "@/src/common/domain/utils/promises";
import {
  InputFormField,
  PasswordInputFormField,
} from "@/src/common/ui/components/form/form-fields";
import { FormGlobalErrorMessage } from "@/src/common/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/common/ui/components/form/form-submit-button";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import { Check } from "lucide-react";
import Link from "next/link";
import { signupAction } from "../actions/signup-action";

const SignupFormSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(256),
});

export function SignupForm() {
  const form = useForm({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof SignupFormSchema>) {
    try {
      const response = await signupAction(data);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            href="https://raw.githubusercontent.com/arnaugomez/clubmemo.web/main/LICENSE.txt"
            target="_blank"
          >
            licencia de uso
          </a>{" "}
          y la{" "}
          <a className="underline" href="">
            política de privacidad.
          </a>
        </p>
      </form>
    </FormProvider>
  );
}
