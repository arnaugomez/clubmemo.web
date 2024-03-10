"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { InputFormField } from "@/lib/ui/components/form/form-fields";
import { Button } from "@/lib/ui/components/shadcn/ui/button";
import { Form } from "@/lib/ui/components/shadcn/ui/form";
import { Check } from "lucide-react";
import Link from "next/link";

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function RegisterForm() {
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
        <div className="flex space-x-6 justify-between">
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button>Crear cuenta</Button>
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
