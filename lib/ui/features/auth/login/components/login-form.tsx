"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { InputFormField } from "@/lib/ui/components/form/form-fields";
import { Button } from "@/lib/ui/components/shadcn/ui/button";
import { Form } from "@/lib/ui/components/shadcn/ui/form";
import Link from "next/link";
import { cn } from "@/lib/ui/utils/shadcn";
import { textStyles } from "@/lib/ui/styles/text-styles";

const FormSchema = z.object({
  email: z.string().email(),
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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
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
        <InputFormField
          label="Contraseña"
          name="password"
          placeholder="Tu contraseña"
          type="password"
          autoComplete="current-password"
        />
        <div className="h-2" />
        <p className={cn(textStyles.muted, "text-right hover:underline")}>
          <Link className="" href="/auth/forgot-password">
            Olvidaste tu contraseña?
          </Link>
        </p>
        <div className="h-6" />
        <div className="flex space-x-6 justify-between">
          <Button variant="ghost" asChild>
            <Link href="/auth/register">Nuevo usuario</Link>
          </Button>
          <Button>Login</Button>
        </div>
      </form>
    </Form>
  );
}
