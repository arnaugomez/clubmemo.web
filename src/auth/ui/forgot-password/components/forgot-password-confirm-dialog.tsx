import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/common/ui/components/shadcn/ui/dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ForgotPasswordConfirmDialogProps {
  email: string;
}

/**
 * Confirmation dialog that pops up after the reset password email is sent.
 */
export function ForgotPasswordConfirmDialog({
  email,
}: ForgotPasswordConfirmDialogProps) {
  const router = useRouter();
  return (
    <Dialog open>
      <DialogContent
        className="sm:max-w-[425px]"
        onClose={() => router.push("/")}
      >
        <DialogHeader>
          <DialogTitle>Correo enviado</DialogTitle>
          <DialogDescription>
            Te hemos enviado un correo electrónico de recuperación a la
            dirección {email}.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" asChild>
            <Link href="/">Aceptar</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
