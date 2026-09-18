"use client";
import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { captureError } from "@/src/common/effect/client-runtime";
import { AsyncButton } from "@/src/common/ui/components/button/async-button";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/common/ui/components/shadcn/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "../shadcn/ui/alert";

interface ConfirmDialogProps {
  title: string;
  description: string;
  acceptButtonText: string;
  acceptButtonVariant?: "default" | "destructive";
  alertTitle?: string;
  alertDescription?: string;

  onClose: () => void;
  onAccept: () => Promise<boolean>;
}

export function ConfirmDialog({
  onClose,
  onAccept,
  title,
  description,
  alertTitle,
  alertDescription,
  acceptButtonText,
  acceptButtonVariant,
}: ConfirmDialogProps) {
  async function handleAcceptButtonClick() {
    try {
      const isSuccessful = await onAccept();
      if (isSuccessful) {
        onClose();
      }
    } catch (error) {
      captureError(error);
      toast.error("Ha ocurrido un error");
    }
  }

  return (
    <Dialog open>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle className="mr-4">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          {alertTitle && (
            <>
              <div className="h-1"></div>
              <Alert>
                <TriangleAlert size={16} />
                <AlertTitle>{alertTitle}</AlertTitle>
                {alertDescription && (
                  <AlertDescription>{alertDescription}</AlertDescription>
                )}
              </Alert>
              <div className="h-1"></div>
            </>
          )}
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Volver
          </Button>
          <AsyncButton
            onClick={handleAcceptButtonClick}
            variant={acceptButtonVariant}
          >
            {acceptButtonText}
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
