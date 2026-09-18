"use client";
import * as Schema from "effect/Schema";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { waitMilliseconds } from "@/src/common/domain/utils/promise";
import { captureError } from "@/src/common/effect/client-runtime";
import { schemaResolver } from "@/src/common/effect/schema-resolver";
import { EmailSchema } from "@/src/common/schemas/email-schema";
import { PasswordSchema } from "@/src/common/schemas/password-schema";
import { CheckboxFormField } from "@/src/common/ui/components/form/checkbox-form-field";
import { FormGlobalErrorMessage } from "@/src/common/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/common/ui/components/form/form-submit-button";
import { InputFormField } from "@/src/common/ui/components/form/input-form-field";
import { PasswordInputFormField } from "@/src/common/ui/components/form/password-input-form-field";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import { signupAction } from "../actions/signup-action";

const SignupFormSchema = Schema.Struct({
  email: EmailSchema,
  password: PasswordSchema,
  acceptTerms: Schema.Boolean,
});

/**
 * Form that creates a new user account with an email and password. When the
 * form is submitted, the user is created, or an error message is shown.
 */
export function SignupForm() {
  const form = useForm({
    resolver: schemaResolver(SignupFormSchema),
    defaultValues: {
      email: "",
      password: "",
      acceptTerms: false,
    },
  });

  const onSubmit = form.handleSubmit(
    async (data: (typeof SignupFormSchema)["Type"]) => {
      try {
        const response = await signupAction(data);
        const handler = new FormResponseHandler(response, form);
        if (!handler.hasErrors) await waitMilliseconds(1000);
        handler.setErrors();
      } catch (error) {
        captureError(error);
        FormResponseHandler.setGlobalError(form);
      }
    },
  );
  const acceptTerms = form.watch("acceptTerms");

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <InputFormField
          label="Correo electrónico"
          name="email"
          placeholder="Tu correo electrónico"
          autoComplete="email"
        />
        <PasswordInputFormField
          label="Contraseña"
          name="password"
          placeholder="Tu contraseña"
          autoComplete="new-password"
        />
        <CheckboxFormField
          name="acceptTerms"
          label={
            <>
              Acepto la{" "}
              <a
                className="underline"
                href="/compliance/license.txt"
                target="_blank"
                rel="noopener"
              >
                licencia de uso
              </a>
              , la{" "}
              <a
                className="underline"
                href="/compliance/cookies.md"
                target="_blank"
                rel="noopener"
              >
                política de cookies
              </a>{" "}
              y la{" "}
              <a
                className="underline"
                href="/compliance/privacy.md"
                target="_blank"
                rel="noopener"
              >
                política de privacidad.
              </a>
            </>
          }
        />
        <FormGlobalErrorMessage />
        <div className="flex justify-between space-x-6">
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
          <FormSubmitButton disabled={!acceptTerms}>
            Crear cuenta
          </FormSubmitButton>
        </div>
      </form>
    </FormProvider>
  );
}
