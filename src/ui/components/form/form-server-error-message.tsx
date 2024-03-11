import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "../../utils/shadcn";

const FormServerErrorMessage = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { errors } = useFormContext().formState;
  const body = errors.root?.serverError
    ? String(errors.root?.serverError.message)
    : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormServerErrorMessage.displayName = "FormServerErrorMessage";
export { FormServerErrorMessage };
