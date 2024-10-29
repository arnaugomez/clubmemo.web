import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/src/common/ui/components/shadcn/ui/alert";
import { Inbox } from "lucide-react";

/**
 * An alert that informs the user that the email verification code has expired.
 */
export function VerifyEmailExpiredAlert() {
  return (
    <Alert>
      <Inbox size={16} />
      <AlertTitle>Revisa de nuevo tu correo</AlertTitle>
      <AlertDescription>
        El código de verificación anterior ha expirado. Te hemos enviado uno
        nuevo.
      </AlertDescription>
    </Alert>
  );
}
