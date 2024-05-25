"use client";

import { z } from "@/i18n/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { waitMilliseconds } from "@/src/common/domain/utils/promises";
import { AsyncButton } from "@/src/common/ui/components/button/async-button";
import { InputOtpFormField } from "@/src/common/ui/components/form/form-fields";
import { FormGlobalErrorMessage } from "@/src/common/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/common/ui/components/form/form-submit-button";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
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
    <FormProvider {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
        <InputOtpFormField />
        <div className="h-2" />
        <FormGlobalErrorMessage />
        <div className="h-6" />
        <div className="flex justify-between space-x-6">
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
    </FormProvider>
  );
}
