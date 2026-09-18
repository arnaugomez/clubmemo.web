"use client";
import * as Schema from "effect/Schema";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { waitMilliseconds } from "@/src/common/domain/utils/promise";
import { captureError } from "@/src/common/effect/client-runtime";
import { schemaResolver } from "@/src/common/effect/schema-resolver";
import { PasswordSchema } from "@/src/common/schemas/password-schema";
import { FormGlobalErrorMessage } from "@/src/common/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/common/ui/components/form/form-submit-button";
import { PasswordInputFormField } from "@/src/common/ui/components/form/password-input-form-field";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import { resetPasswordAction } from "../actions/reset-password-action";

const ResetPasswordConfirmDialog = dynamic(() =>
  import("./reset-password-confirm-dialog").then(
    (file) => file.ResetPasswordConfirmDialog,
  ),
);

/**
 * Form that the user fills in to change its password after receiving a reset
 * password email.
 */
const FormSchema = Schema.Struct({
  password: PasswordSchema,
  repeatPassword: PasswordSchema,
}).check(
  Schema.makeFilter(({ password, repeatPassword }) =>
    password === repeatPassword
      ? undefined
      : { path: ["repeatPassword"], issue: "Las contraseñas no coinciden" },
  ),
);

interface Props {
  email: string;
  token: string;
}

export function ResetPasswordForm({ email, token }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm({
    resolver: schemaResolver(FormSchema),
    defaultValues: {
      password: "",
      repeatPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(
    async (data: (typeof FormSchema)["Type"]) => {
      try {
        const response = await resetPasswordAction({
          email,
          token,
          password: data.password,
        });

        const handler = new FormResponseHandler(response, form);
        if (!handler.hasErrors) {
          setIsDialogOpen(true);
          await waitMilliseconds(1000);
        }
        handler.setErrors();
      } catch (error) {
        captureError(error);
        FormResponseHandler.setGlobalError(form);
      }
    },
  );

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <PasswordInputFormField
            label="Contraseña"
            name="password"
            placeholder="Tu nueva contraseña"
            autoComplete="new-password"
          />

          <PasswordInputFormField
            label="Repetir contraseña"
            name="repeatPassword"
            placeholder="Repite tu nueva contraseña"
            autoComplete="new-password"
          />

          <FormGlobalErrorMessage />
          <div className="flex justify-between space-x-6">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <FormSubmitButton>Enviar</FormSubmitButton>
          </div>
        </form>
      </FormProvider>
      {isDialogOpen && <ResetPasswordConfirmDialog email={email} />}
    </>
  );
}
