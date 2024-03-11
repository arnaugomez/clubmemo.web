"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { InputFormField } from "@/src/ui/components/form/form-fields";
import { FormServerErrorMessage } from "@/src/ui/components/form/form-server-error-message";
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
      handler.setErrors();
    } catch (error) {
      console.error(error);
      FormResponseHandler.setGeneralError(form);
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
        <FormServerErrorMessage />
        <div className="flex space-x-6 justify-between">
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button disabled={form.formState.isSubmitting}>Crear cuenta</Button>
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
