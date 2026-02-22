import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/common/ui/components/shadcn/ui/dialog";

interface ResetPasswordConfirmDialogProps {
  email: string;
}

/**
 * Dialog that appears after the password is successfully reset
 */
export function ResetPasswordConfirmDialog({
  email,
}: ResetPasswordConfirmDialogProps) {
  const router = useRouter();
  return (
    <Dialog open>
      <DialogContent
        onClose={() => router.push("/auth/login")}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Contraseña modificada</DialogTitle>
          <DialogDescription>
            La contraseña del usuario {email} ha sido modificada. Ya puedes
            iniciar sesión con tu nueva contraseña.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
