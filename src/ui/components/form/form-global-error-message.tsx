import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "../../utils/shadcn";

const FormGlobalErrorMessage = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { errors } = useFormContext().formState;
  const body = errors.root?.globalError
    ? String(errors.root?.globalError.message)
    : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      className={cn(
        "text-sm font-medium text-destructive pt-2 pb-4",
        className,
      )}
      {...props}
    >
      {body}
    </p>
  );
});
FormGlobalErrorMessage.displayName = "FormGlobalErrorMessage";
export { FormGlobalErrorMessage };
