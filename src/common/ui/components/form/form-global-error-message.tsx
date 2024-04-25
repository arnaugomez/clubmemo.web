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
        "pb-4 pt-2 text-sm font-medium text-destructive",
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
