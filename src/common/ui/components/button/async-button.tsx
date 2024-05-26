import { Loader2 } from "lucide-react";
import { forwardRef, useState } from "react";
import type { ButtonProps } from "../shadcn/ui/button";
import { Button } from "../shadcn/ui/button";

interface AsyncButtonProps extends ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>;
}

const AsyncButton = forwardRef<HTMLButtonElement, AsyncButtonProps>(
  ({ children, onClick, ...props }, ref) => {
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
      <Button onClick={handleClick} disabled={isLoading} {...props} ref={ref}>
        {isLoading && <Loader2 className="mr-3 animate-spin" />}
        {children}
      </Button>
    );
  },
);

AsyncButton.displayName = "AsyncButton";
export { AsyncButton };
