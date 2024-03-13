"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { InputFormField } from "@/src/ui/components/form/form-fields";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { Form } from "@/src/ui/components/shadcn/ui/form";
import Link from "next/link";

const FormSchema = z.object({
  password: z.string().min(8),
  repeatPassword: z.string(),
});

export function ResetPasswordForm() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      repeatPassword: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <InputFormField
          label="Contraseña"
          name="password"
          placeholder="Tu nueva contraseña"
          type="password"
          autoComplete="new-password"
        />
        <InputFormField
          label="Repetir contraseña"
          name="repeatPassword"
          placeholder="Repite tu nueva contraseña"
          type="password"
          autoComplete="new-password"
        />
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
