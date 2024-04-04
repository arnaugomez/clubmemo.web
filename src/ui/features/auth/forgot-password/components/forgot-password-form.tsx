"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { FormResponseHandler } from "@/src/ui/models/server-form-errors";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { forgotPasswordAction } from "../actions/forgot-password-action";

const FormSchema = z.object({
  email: z.string().email().max(254),
});

export function ForgotPasswordForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
            label="Correo electrónico"
            name="email"
            placeholder="Tu correo electrónico"
            autoComplete="email"
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
      {isDialogOpen && <ConfirmDialog email={form.getValues("email")} />}
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
        className="sm:max-w-[425px]"
        onClose={() => router.push("/")}
      >
        <DialogHeader>
          <DialogTitle>Correo enviado</DialogTitle>
          <DialogDescription>
            Te hemos enviado un correo electrónico de recuperación a la
            dirección {email}.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" asChild>
            <Link href="/">Aceptar</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
