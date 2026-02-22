import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../shadcn/ui/input-otp";

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
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot
                      // biome-ignore lint/suspicious/noArrayIndexKey: static list
                      key={index}
                      {...slot}
                    />
                  ))}
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
