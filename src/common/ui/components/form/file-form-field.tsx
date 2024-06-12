import type { ReactNode } from "react";
import type { Accept } from "react-dropzone";
import { FileInput } from "../input/file-input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/ui/form";

interface FileFormFieldProps {
  name: string;
  label: string;
  accept: Accept;
  maxSize: number;
  fileIcon?: ReactNode;
  isImage?: boolean;
}

export function FileFormField({
  label,
  name,
  accept,
  maxSize,
  fileIcon,
  isImage,
}: FileFormFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <FileInput
              value={field.value}
              isImage={isImage}
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
