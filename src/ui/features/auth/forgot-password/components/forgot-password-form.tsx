"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { InputFormField } from "@/src/ui/components/form/form-fields";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { Form } from "@/src/ui/components/shadcn/ui/form";
import Link from "next/link";
import { forgotPasswordAction } from "../actions/forgot-password-action";
import { FormGlobalErrorMessage } from "@/src/ui/components/form/form-global-error-message";
import { FormResponseHandler } from "@/src/ui/view-models/server-form-errors";

const FormSchema = z.object({
  email: z.string().email(),
});

export function ForgotPasswordForm() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await forgotPasswordAction(data.email);
      const handler = new FormResponseHandler(response, form);
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
        <FormGlobalErrorMessage />
        <div className="h-6" />
        <div className="flex space-x-6 justify-between">
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button>Enviar</Button>
        </div>
      </form>
    </Form>
  );
}
