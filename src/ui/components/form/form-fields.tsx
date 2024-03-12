import { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/ui/form";
import { Input } from "../shadcn/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../shadcn/ui/input-otp";

interface InputFormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: HTMLInputAutoCompleteAttribute;
}

export function InputFormField({
  label,
  name,
  placeholder,
  type,
  autoComplete,
}: InputFormFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function InputOtpFormField() {
  return (
    <FormField
      name="code"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Código de verificación</FormLabel>
          <FormControl>
            <InputOTP
              maxLength={6}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} />
                  ))}{" "}
                </InputOTPGroup>
              )}
              {...field}
            />
          </FormControl>
          <FormDescription>
            Introduce el código de verificación que te hemos enviado.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
