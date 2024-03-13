"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { waitMilliseconds } from "@/src/core/app/utils/promises";
import { AsyncButton } from "@/src/ui/components/button/async-button";
import { InputOtpFormField } from "@/src/ui/components/form/form-fields";
import { FormGlobalErrorMessage } from "@/src/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/ui/components/form/form-submit-button";
import { Form } from "@/src/ui/components/shadcn/ui/form";
import { FormResponseHandler } from "@/src/ui/view-models/server-form-errors";
import { useEffect, useRef } from "react";
import { logoutAction } from "../../actions/logout-action";
import { verifyEmailAction } from "../actions/verify-email-action";

const FormSchema = z.object({
  code: z.string().length(6),
});

export function VerifyEmailForm() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  });
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await verifyEmailAction(data);
      const handler = new FormResponseHandler(response, form);
      if (!handler.hasErrors) waitMilliseconds(1000);
      handler.setErrors();
    } catch (error) {
      console.error(error);
      FormResponseHandler.setGlobalError(form);
    }
  }
  const code = form.watch("code");

  useEffect(() => {
    if (code.length === 6) {
      formRef?.current?.requestSubmit();
    }
  }, [code]);

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
        <InputOtpFormField />
        <div className="h-2" />
        <FormGlobalErrorMessage />
        <div className="h-6" />
        <div className="flex space-x-6 justify-between">
          <AsyncButton
            type="button"
            onClick={() => logoutAction()}
            variant="ghost"
          >
            Logout
          </AsyncButton>
          <FormSubmitButton>Enviar</FormSubmitButton>
        </div>
      </form>
    </Form>
  );
}
