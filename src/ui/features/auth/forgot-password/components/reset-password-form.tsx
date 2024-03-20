"use client";

import { InputFormField } from "@/src/ui/components/form/form-fields";
import { FormGlobalErrorMessage } from "@/src/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/ui/components/form/form-submit-button";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/components/shadcn/ui/dialog";
import { Form } from "@/src/ui/components/shadcn/ui/form";
import { FormResponseHandler } from "@/src/ui/view-models/server-form-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { resetPasswordAction } from "../actions/reset-password-action";
import { useRouter } from "next/navigation";

const FormSchema = z
  .object({
    password: z.string().min(8).max(256),
    repeatPassword: z.string(),
  })
  .superRefine(({ password, repeatPassword }, ctx) => {
    if (password !== repeatPassword) {
      ctx.addIssue({
        path: ["repeatPassword"],
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });

interface Props {
  email: string;
}

export function ResetPasswordForm({ email }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      repeatPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await resetPasswordAction({
        email,
        password: data.password,
      });

      const handler = new FormResponseHandler(response, form);
      if (!handler.hasErrors) setIsDialogOpen(true);
      handler.setErrors();
    } catch (error) {
      console.error(error);
      FormResponseHandler.setGlobalError(form);
    }
  }

  return (
    <>
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

          <FormGlobalErrorMessage />
          <div className="flex space-x-6 justify-between">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <FormSubmitButton>Enviar</FormSubmitButton>
          </div>
        </form>
      </Form>
      {isDialogOpen && <ConfirmDialog email={email} />}
    </>
  );
}

interface ConfirmDialogProps {
  email: string;
}
export function ConfirmDialog({ email }: ConfirmDialogProps) {
  const router = useRouter();
  return (
    <Dialog open>
      <DialogContent
        onClose={() => router.push("/auth/login")}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Contraseña modificada</DialogTitle>
          <DialogDescription>
            La contraseña del usuario {email} ha sido modificada. Ya puedes
            iniciar sesión con tu nueva contraseña.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
