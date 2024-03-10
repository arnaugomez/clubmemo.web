import { textStyles } from "@/lib/ui/styles/text-styles";
import { MailCheck } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <>
      <div className="w-full max-w-prose">
        <MailCheck size={32} />
        <div className="h-6"></div>
        <h1 className={textStyles.h2}>¡Ya casi estamos!</h1>
        <div className="h-4"></div>
        <p>
          Te hemos enviado un correo electrónico a TODO con instrucciones para
          verificar tu cuenta.
        </p>
      </div>
    </>
  );
}
