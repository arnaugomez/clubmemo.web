import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  HTMLInputAutoCompleteAttribute,
  HTMLInputTypeAttribute,
  ReactNode,
} from "react";
import { PasswordInput } from "../input/password-input";
import TagsInput from "../input/tags-input";
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
import { Switch } from "../shadcn/ui/switch";
import { Textarea } from "../shadcn/ui/textarea";
import { FileInput } from "../input/file-input";
import { Accept } from "react-dropzone";

interface InputFormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
}

export function InputFormField({
  label,
  name,
  placeholder,
  type,
  autoComplete,
  onPaste,
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
              onPaste={onPaste}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function PasswordInputFormField({
  label,
  name,
  placeholder,
  autoComplete,
}: InputFormFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <PasswordInput
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
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} />
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

interface TextareaFormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
}

export function TextareaFormField({
  label,
  name,
  placeholder,
  autoComplete,
}: TextareaFormFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              autoComplete={autoComplete}
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface SwitchSectionFormFieldProps {
  name: string;
  label: string;
  description: string;
}

export function SwitchSectionFormField({
  name,
  label,
  description,
}: SwitchSectionFormFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

interface TagsFormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
}

export function TagsFormField({
  label,
  name,
  placeholder,
}: TagsFormFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <TagsInput
              name={name}
              id={field.name}
              placeholder={placeholder}
              value={field.value}
              onChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
interface FileFormFieldProps {
  name: string;
  label: string;
  accept: Accept;
  maxSize: number;
  fileIcon?: ReactNode;
}

export function FileFormField({
  label,
  name,
  accept,
  maxSize,
  fileIcon,
}: FileFormFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <FileInput
              name={name}
              id={field.name}
              onChange={field.onChange}
              accept={accept}
              maxSize={maxSize}
              fileIcon={fileIcon}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
