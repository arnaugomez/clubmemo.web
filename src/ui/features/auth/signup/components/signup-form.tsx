"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { waitMilliseconds } from "@/src/core/app/utils/promises";
import { InputFormField } from "@/src/ui/components/form/form-fields";
import { FormGlobalErrorMessage } from "@/src/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/ui/components/form/form-submit-button";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { Form } from "@/src/ui/components/shadcn/ui/form";
import { FormResponseHandler } from "@/src/ui/view-models/server-form-errors";
import { Check } from "lucide-react";
import Link from "next/link";
import { signupAction } from "../actions/signup-action";

const SignupFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <InputFormField
          label="Correo electrónico"
          name="email"
          placeholder="Tu correo electrónico"
          autoComplete="email"
        />
        <InputFormField
          label="Contraseña"
          name="password"
          placeholder="Tu contraseña"
          type="password"
          autoComplete="new-password"
        />
        <FormGlobalErrorMessage />
        <div className="flex space-x-6 justify-between">
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
    </Form>
  );
}
