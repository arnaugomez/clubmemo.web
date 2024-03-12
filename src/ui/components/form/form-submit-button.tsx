import { Loader2 } from "lucide-react";
import { PropsWithChildren } from "react";
import { useFormState } from "react-hook-form";
import { Button } from "../shadcn/ui/button";

export function FormSubmitButton({ children }: PropsWithChildren) {
  const { isSubmitting } = useFormState();
  return (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting && <Loader2 className="mr-3 animate-spin" />}
      {children}
    </Button>
  );
}
