import { Loader2 } from "lucide-react";
import type { PropsWithChildren } from "react";
import { useFormState } from "react-hook-form";
import type { ButtonProps } from "../shadcn/ui/button";
import { Button } from "../shadcn/ui/button";

interface FormSubmitButtonProps extends PropsWithChildren, ButtonProps {}

export function FormSubmitButton({
  children,
  ...props
}: FormSubmitButtonProps) {
  const { isSubmitting } = useFormState();
  return (
    <Button type="submit" disabled={isSubmitting} {...props}>
      {isSubmitting && <Loader2 className="mr-3 animate-spin" />}
      {children}
    </Button>
  );
}
