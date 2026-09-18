"use client";
import * as Schema from "effect/Schema";
import { useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { waitMilliseconds } from "@/src/common/domain/utils/promise";
import { captureError } from "@/src/common/effect/client-runtime";
import { schemaResolver } from "@/src/common/effect/schema-resolver";
import { AsyncButton } from "@/src/common/ui/components/button/async-button";
import { FormGlobalErrorMessage } from "@/src/common/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/common/ui/components/form/form-submit-button";
import { InputOtpFormField } from "@/src/common/ui/components/form/input-otp-form-field";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import { logoutAction } from "../../actions/logout-action";
import { verifyEmailAction } from "../actions/verify-email-action";

const FormSchema = Schema.Struct({
  code: Schema.String.check(
    Schema.isLengthBetween(6, 6, {
      message: `El texto debe contener exactamente ${6} carácter(es)`,
    }),
  ),
});

/**
 * Form that verifies the email of an existing user, by submitting an email
 * verification code. When the form is submitted, the email is marked as verified.
 */
export function VerifyEmailForm() {
  const form = useForm({
    resolver: schemaResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  });
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = form.handleSubmit(
    async (data: (typeof FormSchema)["Type"]) => {
      try {
        const response = await verifyEmailAction(data);
        const handler = new FormResponseHandler(response, form);
        if (!handler.hasErrors) waitMilliseconds(1000);
        handler.setErrors();
      } catch (error) {
        captureError(error);
        FormResponseHandler.setGlobalError(form);
      }
    },
  );
  const code = form.watch("code");

  useEffect(() => {
    if (code.length === 6) {
      formRef?.current?.requestSubmit();
    }
  }, [code]);

  async function handleLogout() {
    try {
      await logoutAction();
    } catch (error) {
      captureError(error);
      toast.error("Error al cerrar sesión");
    }
  }

  return (
    <FormProvider {...form}>
      <form ref={formRef} onSubmit={onSubmit}>
        <InputOtpFormField />
        <div className="h-2" />
        <FormGlobalErrorMessage />
        <div className="h-6" />
        <div className="flex justify-between space-x-6">
          <AsyncButton type="button" onClick={handleLogout} variant="ghost">
            Logout
          </AsyncButton>
          <FormSubmitButton>Enviar</FormSubmitButton>
        </div>
      </form>
    </FormProvider>
  );
}
