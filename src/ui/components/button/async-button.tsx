import { Loader2 } from "lucide-react";
import { forwardRef, useState } from "react";
import { Button, ButtonProps } from "../shadcn/ui/button";

const AsyncButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, onClick, ...props }) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleClick: ButtonProps["onClick"] = async (e) => {
      try {
        setIsLoading(true);
        await onClick?.(e);
      } catch (e) {
        throw e;
      } finally {
        setIsLoading(false);
      }
    };
    return (
      <Button onClick={handleClick} disabled={isLoading} {...props}>
        {isLoading && <Loader2 className="mr-3 animate-spin" />}
        {children}
      </Button>
    );
  },
);

AsyncButton.displayName = "AsyncButton";
export { AsyncButton };
